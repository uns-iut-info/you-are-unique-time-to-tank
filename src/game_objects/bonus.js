class Bonus extends ObjectPos {


    static diameter = 1;
    /**
     * 
     * @param {number} posX
     * @param {number} posY
     * @param {boolean} isSpecial
     */
    constructor(posX, posY, isSpecial = false) {
        super(ObjectEnum.Bonus, -width / 2 + posX, Bonus.diameter / 2, -height / 2 + posY, 0, 0, 1);
        this.physicsImpostor = new BABYLON.PhysicsImpostor(this.shape, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 50000, restitution: 0.5 });
        this.createCollider()
        this.bonusEffect = createBonusEffect(this.shape)
    }

    createCollider() {
        this.physicsImpostor.onCollideEvent = (e1, e2) => {

            let b1 = bonuses.find(e => e.shape == e1.object)
            if (e2.object == char1.shape) {
                if (b1) {
                    scene.menu.bonusChoice(Bonus.randomBonus(3))
                    b1.dispose(true);
                    current_level_dico.addBonusObtained()
                }
            }
        }
    }

    static randomBonus(num) {
        var res = []
        var copy_bonusEnum = BonusEnum.bonusEnumList.slice()
        for (var i = 0; i < num; i++) {
            var rand = Math.floor(Math.random() * copy_bonusEnum.length)
            res.push(copy_bonusEnum[rand])
            copy_bonusEnum.splice(rand, 1)
        }
        return res
    }

    dispose(forceDispose = false) {
        super.dispose(forceDispose)
        this.bonusEffect.dispose()
    }
}