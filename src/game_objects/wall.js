class Wall {

    static height = cell_size;
    static width = cell_size;
    static depth = cell_size;
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {boolean} destructable 
     */
    constructor(x, y, destructable) {
        this.type = destructable ? ObjectEnum.WallD : ObjectEnum.Wall
        this.destructable = destructable
        // super(destructable ? ObjectEnum.WallD : ObjectEnum.Wall, -width / 2 + x, Wall.height / 2, - height / 2 + y, 0, 0)
        this.shape = this.createShape();
        this.shape.position = new BABYLON.Vector3(-width / 2 + x, Wall.height / 2, - height / 2 + y)
        this.shape.physicsImpostor = new BABYLON.PhysicsImpostor(this.shape, BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 0, restitution: 1, friction: 0 });
        this.shape.showBoundingBox = true
    }

    destroy() {
        if (this.destructable === true) {
            let position = walls.indexOf(this);
            this.shape.dispose();
            walls.splice(position, 1);
        }
    }

    createShape() {
        var shape = BABYLON.MeshBuilder.CreateBox("box",
            { height: Wall.height, width: Wall.width, depth: Wall.depth }, scene);
        shape.material = createMaterial(scene, this.type.name);
        return shape;
    }
}

class WallPerimeter {
    constructor(x, y, width, depth) {
        this.width = width * cell_size;
        this.depth = depth * cell_size;
        this.shape = this.createShape();
        this.shape.position = new BABYLON.Vector3(x * cell_size, Wall.height / 2, y * cell_size)
        this.shape.physicsImpostor = new BABYLON.PhysicsImpostor(this.shape, BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 0, restitution: 1, friction: 0 });
        this.shape.showBoundingBox = true
    }

    createShape() {
        var shape = BABYLON.MeshBuilder.CreateBox("box",
            { height: Wall.height, width: this.width, depth: this.depth }, scene);
        shape.material = createMaterial(scene, ObjectEnum.Wall.name);
        return shape;
    }
}