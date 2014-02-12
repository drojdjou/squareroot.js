SQR.Color = function() {

    var rgb =  new Float32Array([1.0, 1.0, 1.0]);
    var rgba = new Float32Array([1.0, 1.0, 1.0, 1.0]);

    var r = 0.0, g = 0.0, b = 0.0;
    var h = 0.0, s = 1.0, l = 0.0;
    var a = 1.0;

    this.rgb = function(red, green, blue) {
        if(red != null && red >= 0) this.red(red);
        if(green != null && green >= 0) this.green(green);
        if(blue != null && blue >= 0) this.blue(blue);
        return this;
    }

    this.grey = function(greylevel) {
        this.rgb(greylevel, greylevel, greylevel);
        return this;
    }

    this.hsl = function(hue, saturation, lightness) {
        h = hue;
        s = saturation;
        l = lightness;
        this.hslToRgb();
        return this;
    }

    this.intRGB = function(red, green, blue) {
        this.rgb(red/255, green/255, blue/255);
        return this;
    }

    this.cssHsl = function(hue, saturation, lightness) {
        h = hue/255;
        s = saturation/100;
        l = lightness/100;
        this.hslToRgb();
        return this;
    }

    // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    this.hex = function(hex) {

        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        this.red(parseInt(result[1], 16) / 255);
        this.green(parseInt(result[2], 16) / 255);
        this.blue(parseInt(result[3], 16) / 255);
        return this;
    }

    this.red = function(value) {
        if(value == undefined || value == null) return r;
        r = value;
        rgb[0] = r;
        rgba[0] = r;
        return this;
    }

    this.green = function(value) {
        if(value == undefined || value == null) return g;
        g = value;
        rgb[1] = g;
        rgba[1] = g;
        return this;
    }

    this.blue = function(value) {
        if(value == undefined || value == null) return b;
        b = value;
        rgb[2] = b;
        rgba[2] = b;
        return this;
    }

    this.alpha = function(value) {
        if(value == undefined || value == null) return a;
        a = value;
        rgba[3] = a;
        return this;
    }
    
    this.hue = function(value) {
        if(value == undefined || value == null) return h;
        h = value;
        return this;
    } 

    this.saturation = function(value) {
        if(value == undefined || value == null) return s;
        s = value;
        return this;
        
    } 

    this.lightness = function(value) {
        if(value == undefined || value == null) return l;
        l = value;
        return this;
    } 

    // this and next: http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
    this.hslToRgb = function() {
        if(s == 0){
            this.rgb(l, l, l);
        } else {
            function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            this.red(hue2rgb(p, q, h + 1/3));
            this.green(hue2rgb(p, q, h));
            this.blue(hue2rgb(p, q, h - 1/3));
        }
        return this;
    }

    this.rgbToHsl = function() {
        var max = Math.max(r, g, b), min = Math.min(r, g, b);

        l = (max + min) / 2;

        if(max == min){
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return this;
    }

    this.toCss = function(noAlpha) {
        var ri = parseInt(r * 255);
        var gi = parseInt(g * 255);
        var bi = parseInt(b * 255);
        return (noAlpha) ? 'rgb(' + ri + ',' + gi + ',' + bi + ')' : 'rgba(' + ri + ',' + gi + ',' + bi + ',' + a + ')';
    }

    this.toHslCss = function(noAlpha) {
        var hi = parseInt(h * 360);
        var si = parseInt(s * 100);
        var li = parseInt(l * 100);
        return (noAlpha) ? 'rgb(' + hi + ',' + si + '%,' + li + '%)' : 'rgba(' + hi + ',' + si + '%,' + li + '%,' + a + ')';
    }

    // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    this.toHex = function() {
        var ri = parseInt(r * 255);
        var gi = parseInt(g * 255);
        var bi = parseInt(b * 255);
        return "#" + ((1 << 24) + (ri << 16) + (gi << 8) + bi).toString(16).slice(1);
    }   

    this.toUniform = function(type) {
        return (type == SQR.GL.FLOAT_VEC3) ? rgb : rgba;
    }

    this.toString = function() {
        return this.toCss();
    }

    this.random = function(alpha) {
        this.red(Math.random());
        this.green(Math.random());
        this.blue(Math.random());
        if(alpha) this.alpha(Math.random());
        return this;
    }
}



















