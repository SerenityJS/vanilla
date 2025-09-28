import { Rotation, Vector2f, Vector3f } from "@serenityjs/protocol";
import { Entity } from "@serenityjs/core";

import { MobEntityTrait } from "../mob-entity";

class LookAtControl {
  private readonly mob: MobEntityTrait;

  private readonly entity: Entity;

  private yMaxRotationSpeed: number = 2;

  private xMaxRotation: number = 0;

  private target?: Vector3f;

  private lookAtCooldown: number = 0;

  public constructor(mob: MobEntityTrait) {
    this.mob = mob;
    this.entity = mob.getEntity();
  }

  public setTarget(
    target: Vector3f | Entity,
    yMaxRotationSpeed: number,
    xMaxRotation: number
  ): void {
    this.target = target instanceof Entity ? target.position : target;
    this.yMaxRotationSpeed = yMaxRotationSpeed;
    this.xMaxRotation = xMaxRotation;
    this.lookAtCooldown = 2;
  }

  public onTick(): void {
    if (!this.target) return;
    const rotation = this.entity.rotation;
    if (this.resetXRotationOnTick) {
      rotation.pitch = 0;
      rotation.yaw = this.entity.rotation.headYaw;
      rotation.headYaw = this.entity.rotation.headYaw;
      this.entity.setRotation(rotation);
    }

    const { yaw, headYaw } = this.entity.rotation;

    if (this.lookAtCooldown <= 0) {
      rotation.yaw = this.rotateTowards(headYaw, yaw, 10);
      this.entity.setRotation(rotation);
    } else {
      this.lookAtCooldown--;
      const xRot = this.getXRot();
      const yRot = this.getYRot();

      if (yRot) {
        const newHeadYaw = this.rotateTowards(
          headYaw,
          yRot,
          this.yMaxRotationSpeed
        );
        rotation.headYaw = newHeadYaw;
        this.entity.setRotation(rotation);
      }
      if (xRot) {
        const rotation = this.rotateTowards(yaw, xRot, this.xMaxRotation);
        this.entity.rotation.yaw = rotation;
      }
    }
    this.clampHeadRotation();
  }

  private clampHeadRotation(): void {
    if (this.mob.navigation.isDone()) return;
    const rotation = this.entity.rotation;
    const newYaw = this.rotateIfNecessary(rotation.yaw, rotation.headYaw, 75);
    rotation.yaw = newYaw;
    this.entity.setRotation(rotation);
  }

  public get resetXRotationOnTick(): boolean {
    return true;
  }

  public rotateIfNecessary(
    angle1: number,
    angle2: number,
    velocity: number
  ): number {
    const direction = angle2 - angle1;
    const clamped = Math.min(velocity, Math.max(-velocity, direction));

    return angle1 - clamped;
  }

  private getYRot(): number | undefined {
    const direction = this.target!.subtract(this.entity.position);

    if (Math.floor(direction.x) == 0 && Math.floor(direction.z) == 0)
      return undefined;
    return Math.atan2(direction.z, direction.x) * 57.3 - 90;
  }

  private getXRot(): number | undefined {
    const direction = this.target!.subtract(this.entity.position);
    const distance = Math.hypot(direction.x, direction.z);

    if (distance < 9e-6 && direction.y < 9e-6) return undefined;
    return -Math.atan2(direction.y, distance) * 57.3;
  }

  private rotateTowards(start: number, end: number, speed: number): number {
    const direction = end - start;
    const step = Math.max(-speed, Math.min(speed, direction));
    return start + step;
  }
}

export { LookAtControl };
