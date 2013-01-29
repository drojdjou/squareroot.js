PieSlice = function() {

    this.startAngle = 0;
    this.angularWidth = 0;

    this.center = 0;

    this.startRadius = 0;
    this.endRadius = 0;

    this.color = null;
    this.margin = 0;

    this.stroke = false;

    this.draw = function(ctx) {

        //
        var ad = this.angularWidth - (this.margin / this.startRadius);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(this.startAngle);
        ctx.translate(-this.center.x, -this.center.y);

        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;

        ctx.beginPath();

        ctx.moveTo(this.center.x + this.startRadius, this.center.y);
        ctx.lineTo(this.center.x + this.endRadius, this.center.y);

        ctx.arc(this.center.x, this.center.y, this.endRadius, 0, ad);

        var cx = this.center.x + Math.cos(ad) * this.startRadius;
        var cy = this.center.y + Math.sin(ad) * this.startRadius;

        ctx.lineTo(cx, cy);

        ctx.arc(this.center.x, this.center.y, this.startRadius, this.angularWidth, 0, true);

        if (this.stroke) ctx.stroke();
        else ctx.fill();

    }
}