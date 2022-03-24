class Char extends ObjectPos {
  static width = cell_size;
  static height = cell_size;
  static depth = cell_size;

  /**
   * @param {number} x 
   * @param {number} y 
   * @param {number} angle 
   * @param {number} vitesse 
   * @param {number} tempsMinEntreTirsEnMillisecondes 
   * @param {HTMLImageElement} img 
   */
  constructor(type, x, y, angle, vitesse, tempsMinEntreTirsEnMillisecondes, bulletSpeed = 40, life = 1) {
    super(type, -width / 2 + x, Char.height / 2, -height / 2 + y, vitesse, angle);
    this.life = life;

    if (type.name == tankImage.src) {
      let camera1 = new BABYLON.FollowCamera("tankCamera", this.getTurretTank().position, scene, this.getTurretTank());
      camera1.radius = 10;
      camera1.heightOffset = 5;
      camera1.rotationOffset = 180;
      camera1.cameraAcceleration = .1;
      camera1.maxCameraSpeed = 10;
      camera.dispose();
      camera = camera1;
      engine.runRenderLoop(() => {

        scene.render()

        if (current_level_number == 0) {
          setTimeout(() => {

            engine.stopRenderLoop()
          },

            500);
        }

      }
      )

    }

    this.delayMinBetweenBullets = tempsMinEntreTirsEnMillisecondes;
    this.delayMinBetweenMines = 5000;
    this.bulletSpeed = bulletSpeed;

    this.shape.physicsImpostor = new BABYLON.PhysicsImpostor(this.shape, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 300000, restitution: 0.2, friction: 0 })

    //this.shape.physicsImpostor = new BABYLON.PhysicsImpostor(this.shape, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 300000, restitution: 0.2 })

    //this.physicsImpostor = new BABYLON.PhysicsImpostor(this, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 30000, restitution: 0.1 })
  }

  moveForeward(coeff) {
    this.move(Math.cos(camera.rotation.y - Math.PI / 2) * coeff, Math.sin(camera.rotation.y - Math.PI / 2) * coeff);
  }

  moveBackward(coeff) {
    this.move(-Math.cos(camera.rotation.y - Math.PI / 2) * coeff, -Math.sin(camera.rotation.y - Math.PI / 2) * coeff);
  }

  addBullet(time) {
    // si le temps écoulé depuis le dernier tir est > temps max alors on tire
    var tempEcoule = 0;

    if (this.lastBulletTime !== undefined) {
      tempEcoule = time - this.lastBulletTime;
    }

    if ((this.lastBulletTime === undefined) || (tempEcoule > this.delayMinBetweenBullets)) {
      var bullet = new Bullet(this, 2)
      bulletFiredSound.play();
      // on mémorise le dernier temps.
      this.lastBulletTime = time;
    }
  }

  addMine(time) {
    var tempEcouleMine = 0;

    if (this.lastMineTime !== undefined) {
      tempEcouleMine = time - this.lastMineTime;
    }

    if ((this.lastMineTime === undefined) || (tempEcouleMine > this.delayMinBetweenMines)) {
      minePlacedSound.play();
      mines.push(new Mine(this));
      // on mémorise le dernier temps.
      this.lastMineTime = time;
    }
  }

  removeChar() {
    let position = chars.indexOf(this);
    this.shape.dispose();
    chars.splice(position, 1);
    explosionSound.play();
    if (this === char1) {
      stopgame();
    } else {
      position = charsAI.indexOf(this);
      charsAI.splice(position, 1);
    }
  }

  createShape() {
    if (true) {
      var shape = BABYLON.MeshBuilder.CreateBox("char", { height: Char.height, depth: Char.depth, width: Char.width }, scene);
      shape.material = createMaterial(scene, "images/tank.png");
      return shape;
    } else {
      // model = await BABYLON.SceneLoader.ImportMeshAsync("", "./models/", "tank.babylon").then((meshes) => {
      //   for (var i = 0; i < meshes.length; i++) {
      //     meshes[i].scaling = new BABYLON.Vector3(0.32, 0.32, 0.32);
      //     // meshes[i].rotation = v
      //   }
      //   console.log('hereeeee');
      //   console.log(this.scene.getMeshByName('german_panzer_ww2_ausf_b.Turret_2'));
      //   x = meshes[0]

      //   console.log(x.rotation);
      //   console.log('this is x in call', x);
      //   x.position.x = 100
      // });
      // console.log('this is x', x);
    }
  }

  rotateAxisY(angle) {
    this.shape.rotate(BABYLON.Axis.Y, angle)
    this.rotateTurretAxisY(-angle)
  }

  rotateTurretAxisY(angle) {
    this.shape.getChildMeshes()[1].rotate(BABYLON.Axis.Y, angle)
  }

  moveTankForeward() {
    this.moveTank(this.speedNorme)
  }

  moveTankBackward() {
    var speed = -12
    this.moveTank(speed)
  }

  moveTank(speed) {
    this.shape.physicsImpostor.setAngularVelocity(
      new BABYLON.Vector3(0, 0, 0))

    //BEGIN: CODE TO ADJUST THE VELOCITY TO OUR NEW DIRECTION

    //we register the linear velocity and apply an opposing force to stop it
    let prevVel = this.shape.physicsImpostor.getLinearVelocity()

    this.shape.physicsImpostor.applyForce(new BABYLON.Vector3(-prevVel.x * 300000,
      0, -prevVel.z * 300000
    ), this.shape.position)

    //we register the coeff between the previous linear velocity and its normalized vector to quatify its power
    let normPreVel = prevVel.normalizeToNew();
    let coeff = prevVel.x / normPreVel.x

    //normalized vector of our current direction
    let normalizedDir = this.shape.getDirection(BABYLON.Axis.Z).normalizeToNew()

    //we give back the force for previous velocity in the right direction using the current
    //direction's normalized vector and multiplying it by the previous velocity's power
    this.shape.physicsImpostor.applyForce(new BABYLON.Vector3(
      coeff * 260000 * normalizedDir.x,
      0,
      coeff * 260000 * normalizedDir.z
    ), this.shape.position)

    //END

    //add new force when asking the tank to move
    let frontVec = this.shape.getDirection(BABYLON.Axis.Z)
    let moveVec = frontVec.scale(speed * 80000)
    let realVec = new BABYLON.Vector3(moveVec.x, this.shape.physicsImpostor.getLinearVelocity().y, moveVec.z)
    this.shape.physicsImpostor.applyForce(realVec, this.shape.position)
    // console.log("linear velocity: ", this.shape.physicsImpostor.getLinearVelocity())
  }

  stabilizeTank(hasFriction = true) {
    // this.shape.physicsImpostor.friction = 0.2
    this.shape.physicsImpostor.dispose()
    this.shape.physicsImpostor = new BABYLON.PhysicsImpostor(this.shape, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 30000, restitution: 0.2, friction: hasFriction ? 0.5 : 0 });
  }

  destroyTank(isDisabled) {
    if (isDisabled) {
      // explode(this.shape)
      var smok = createSmoke(char1.shape)
      playSmoke(smok)
      createFire(char1.shape);
      // ObjectEnum.Player.meshes.forEach(e => e.setParent(null))
      // ObjectEnum.Player.meshes.forEach(e => e.physicsImpostor = new BABYLON.PhysicsImpostor(e, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1 }));
      //console.log("Disposing");
      //this.shape.dispose()
    }
  }

  getTurretTank() {
    return this.shape.getChildMeshes()[1];
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  applyStrategy() {
    this.strategy.applyStrategy()
  }
}