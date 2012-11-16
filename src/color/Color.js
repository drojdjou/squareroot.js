SQR.Color = function(h, s, l, a) {
    this.applyLight = function(dot) {
        return SQR.Color.hsl(h, s, l - 60 + 80 * dot, a);
    }

    this.toHSLString = function() {
        return SQR.Color.hsl(h, s, l, a);
    }
}

SQR.Color.hsl = function(hue, sat, lht, alp) {
    if (alp)
        return 'hsla(' + hue + ',' + sat + '%,' + lht + '%, ' + alp + ')';
    else
        return 'hsl(' + hue + ',' + sat + '%,' + lht + '%)';
}