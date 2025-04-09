import { Vector2f, Vector3f } from "@serenityjs/protocol";
import { Entity } from "@serenityjs/core";

import { MobEntityTrait } from "../mob";

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
    if (this.resetXRotationOnTick)
      this.entity.setHeadRotation(
        new Vector2f(0, this.entity.rotation.headYaw)
      );

    const { pitch, yaw, headYaw } = this.entity.rotation;

    if (this.lookAtCooldown <= 0) {
      this.entity.setHeadRotation(
        new Vector2f(pitch, this.rotateTowards(headYaw, yaw, 10))
      );
    } else {
      this.lookAtCooldown--;
      const xRot = this.getXRot();
      const yRot = this.getYRot();

      if (yRot) {
        const rotation = this.rotateTowards(
          headYaw,
          yRot,
          this.yMaxRotationSpeed
        );
        this.entity.setHeadRotation(new Vector2f(headYaw, rotation));
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
    const { pitch, yaw, headYaw } = this.entity.rotation;
    this.entity.setHeadRotation(
      new Vector2f(pitch, this.rotateIfNecessary(headYaw, yaw, 75))
    );
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
