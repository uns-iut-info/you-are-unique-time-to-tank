class Hole {

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.sizex = 30;
        this.sizey = 30;
        this.height = 1;
        this.x = x + (cell_size - this.sizex) / 2;
        this.y = y + (cell_size - this.sizex) / 2;
        this.shape = create_3d_shape(this, holeImage.src);
    }

    draw3d() {
        place_object(this);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = 'green';
        ctx.drawImage(holeImage, 0, 0, this.sizex, this.sizey);
        ctx.restore();
    }
}