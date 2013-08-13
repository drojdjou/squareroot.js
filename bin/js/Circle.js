Circle = function() {

    this.enabled = true;

    this.center = new SQR.V2();
    this.radius = 0;

    this.color = null;

    this.stroke = false;

    this.draw = function(ctx) {

        if(!this.enabled || this.radius == 0) return;

        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(this.startAngle);
        ctx.translate(-this.center.x, -this.center.y);

        if (this.stroke) ctx.strokeStyle = this.color.toHSLString();
        ctx.fillStyle = this.color.toHSLString();

        ctx.beginPath();

        ctx.arc(this.center.x, this.center.y, this.radius, Math.PI * 2, 0, true);

        if (this.stroke) ctx.stroke();
        ctx.fill();

        ctx.restore();
    }
}