import { ObjectPos } from "./objectPos.js";
import { scene } from "../babylon_start/scene.js";
import { bulletExplode } from "../babylon_start/particles.js";
import { createMaterial } from "../babylon_start/tool_babylon.js";
import { walls, bulletImage, bullets, chars, barrels, trees } from "../main/global_vars.js";
import { ObjectEnum } from "./objectEnum.js";
import { playSoundWithDistanceEffect } from "../tools/utils.js";
import { getCannonPoint } from "../game_IA/shootAI.js";

export class Bullet extends ObjectPos {


    static diameter = 0.2;
    /**
     * 
     * @param {Char} char 
     * @param {number} life 
     * @param {number} speed
     */
    constructor(char, life = 2) {
        super(
            ObjectEnum.Bullet,
            getCannonPoint(char).x, getCannonPoint(char).y, getCannonPoint(char).z, char.bulletSpeed, 0, char.bulletLife);

        this.char = char;
        this.speed = char.bulletSpeed;
        this.damage = char.bulletDamage;

        this.physicsImpostor = new BABYLON.PhysicsImpostor(this, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 1 });
        let frontVec = char.getTurretTank().getDirection(BABYLON.Axis.Z)
        frontVec.y += 0.009
        let moveVec = frontVec.scale(this.speed)
        // let moveVec = new BABYLON.Vector3(moveVec.x, 0, moveVec.z)
        this.physicsImpostor.setLinearVelocity(moveVec)

        // this.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(speed * Math.sin(char.rotation.y * x), 0, speed * Math.cos(char.rotation.y * x)));

        // this.physicsImpostor.restitution = 1;
        // this.physicsImpostor.mass = 1;
        this.physicsImpostor.friction = 0;
        this.coolDownCol = 0;
        bulletExplode(this.position, false, true).start()

        this.createCollider()

        this.trail = new BABYLON.TrailMesh('bulletTrail', this, scene.scene, 0.06, 12, true);

        var sourceMat = new BABYLON.StandardMaterial('sourceMat', scene.scene);
        sourceMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
        sourceMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
        sourceMat.specularColor = new BABYLON.Color3(1, 1, 0);
        sourceMat.alpha = 0.3;

        this.trail.material = sourceMat;
        this.collision = false;
        bullets.push(this)

        this.bulletReboundSound = new Audio('audio/Collision8-Bit.ogg');
        this.setVolumebulletRebound = 0.3
        this.bulletReboundSound.volume = this.setVolumebulletRebound

        this.bulletexplosion = new Audio('audio/bulletExplosion3.mp3');
        this.setVolumebulletexplosion = 0.3
        this.bulletexplosion.volume = this.setVolumebulletexplosion;

        if (scene.char1 == char) scene.current_level_dico.addBulletFired()
    }

    createCollider() {
        this.physicsImpostor.onCollideEvent = (e1, e2) => {

            let b1 = bullets.find(e => e == e1.object)
            let b2;
            if (this.collision == false) {
                this.collision = true
                setTimeout(() => {
                    this.collision = false
                }, 10);
            } else return
            if (this.collision) {
                if (b2 = bullets.find(e => e == e2.object)) {
                    if (b1) b1.dispose(true, true)
                    if (b2) b2.dispose(true, true)
                } else if (b2 = chars.find(e => e.shape == e2.object)) {
                    if (b1) b1.dispose(true, true)
                    if (b2) b2.healthLoss(this.damage)
                    if (this.char == scene.char1 && b2 != scene.char1 && b2.life <= 0)
                        scene.current_level_dico.addKilledChar()
                } else if (b2 = walls.find(e => e.shape == e2.object)) {
                    if (b1) b1.dispose()
                    if (b2) b2.destroy()
                    if (this.char == scene.char1 && b2.destructable)
                        scene.current_level_dico.addWallDestroyed()
                } else if (b2 = barrels.find(e => e.shape == e2.object)) {
                    if (b1) b1.dispose(true, true)
                    // createFire(e2.object);
                    // createSmoke(e2.object);
                    b2.explose()
                    b2.dispose(true)
                    b2.isBurning = true
                } else if (b2 = trees.find(e => e.shape == e2.object)) {
                    if (b1) b1.dispose()
                    if (b2) b2.burnTree()
                }
                else this.dispose()
            }

        }
    }

    destroySound() { return }

    createShape() {
        var shape = BABYLON.MeshBuilder.CreateSphere("bullet", { diameter: Bullet.diameter, segments: 4 }, scene.scene);
        shape.material = createMaterial(scene, bulletImage.src);
        // shape.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY
        scene.hlBalls.addMesh(shape, new BABYLON.Color3(1, 0, 0))

        return shape;
    }

    dispose(forceDispose = false, explosion = false) {
        super.dispose(forceDispose)
        if (this.life <= 0 || forceDispose) {
            this.trail.dispose()
            this.bulletexplosion.volume = this.setVolumebulletexplosion;
            playSoundWithDistanceEffect(this.bulletexplosion, this)
        }
        if (forceDispose && !explosion) return;
        bulletExplode(this.position, this.life == 0).start();
        if (this.life > 0) {
            this.bulletReboundSound.volume = this.setVolumebulletRebound
            playSoundWithDistanceEffect(this.bulletReboundSound, this)
        }

    }
}