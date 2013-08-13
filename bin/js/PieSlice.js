PieSlice = function() {

    this.enabled = true;

    this.startAngle = 0;
    this.angularWidth = 0;

    this.center = new SQR.V2();

    this.startRadius = 0;
    this.endRadius = 0;

    this.color = null;
    this.margin = 0;

    this.stroke = false;

    this.draw = function(ctx) {

        if (!this.enabled || this.angularWidth < 0.01 || Math.abs(this.endRadius - this.startRadius) < 0.1) return;

        var ad = (this.margin / this.endRadius) * 0.5;

        var er = this.endRadius;
        var sr = this.startRadius;

        if(this.useBump) {
            this.bumpPhase += this.bumpSpeed;
            er += Math.abs(Math.sin(this.bumpPhase)) * this.maxBump * this.useBump;
//            sr += Math.abs(Math.sin(this.bumpPhase)) * this.maxBump * this.useBump * 0.5;
        }

        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(this.startAngle + ad);
        ctx.translate(-this.center.x, -this.center.y);

        if (this.stroke) ctx.strokeStyle = this.color.toHSLString();
        ctx.fillStyle = this.color.toHSLString();

        ctx.beginPath();

        ctx.moveTo(this.center.x + sr, this.center.y);
        ctx.lineTo(this.center.x + er, this.center.y);

        ctx.arc(this.center.x, this.center.y, er, 0, this.angularWidth - ad);

        var cx = this.center.x + Math.cos(this.angularWidth - ad) * sr;
        var cy = this.center.y + Math.sin(this.angularWidth - ad) * sr;

        ctx.lineTo(cx, cy);

        ctx.arc(this.center.x, this.center.y, sr, this.angularWidth, 0, true);

        if (this.stroke) ctx.stroke();
        ctx.fill();

        ctx.restore();
    }
}