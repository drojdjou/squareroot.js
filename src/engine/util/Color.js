SQR.Color = {}

SQR.Color.hsl = function(hue, sat, lht, alp) {
    if(alp)
        return 'hsla(' + hue + ',' + sat + '%,' + lht + '%, ' + alp + ')';
    else
        return 'hsl(' + hue + ',' + sat + '%,' + lht + '%)';
}