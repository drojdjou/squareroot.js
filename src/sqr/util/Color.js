SQR.Color = function(h, s, l, a) {

    this.set = function(h, s, l, a) {
        this.hue = h;
        this.saturation = s;
        this.lightness = l;
        this.alpha = a;
    }

    this.applyLight = function(dot) {
        // TODO: remove the hardcoded value!
        return SQR.Color.hsl(this.hue, this.saturation, this.lightness - 60 + 80 * dot, this.alpha);
    }

    this.toHSLString = function() {
        return SQR.Color.hsl(this.hue, this.saturation, this.lightness, this.alpha);
    }

    this.set(h, s, l, a);
}

SQR.Color.hsl = function(hue, sat, lht, alp) {
    if (alp)
        return 'hsla(' + hue + ',' + sat + '%,' + lht + '%, ' + alp + ')';
    else
        return 'hsl(' + hue + ',' + sat + '%,' + lht + '%)';
}