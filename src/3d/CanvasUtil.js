SQR.CanvasUtil = {

    getPixel: function(imageData, x, y) {
        var i = (y * imageData.width + x) * 4;
        return [ imageData.data[i + 0], imageData.data[i + 1], imageData.data[i + 2], imageData.data[i + 3] ];
    },

    setPixel: function(imageData, x, y, r, g, b, a) {
        var i = (y * imageData.width + x) * 4;
        imageData.data[i + 0] = r; 
        imageData.data[i + 1] = g;
        imageData.data[i + 2] = b;
        imageData.data[i + 3] = a;
    },

    getPixelRed: function(imageData, x, y) {
        return imageData.data[ (y * imageData.width + x) * 4 ];
    },

    getPixelAlpha: function(imageData, x, y) {
        return imageData.data[ (y * imageData.width + x) * 4 + 3 ];
    },

    getPixelNormRed: function(imageData, nx, ny) {
        var x = nx * (imageData.width - 1) | 0;
        var y = ny * (imageData.height - 1) | 0;

        var i = y * imageData.width + x;
        return imageData.data[ i * 4 ];
    },

    rotateAround: function(ctx, a, x, y) {
        ctx.translate(x, y);
        ctx.rotate(a);
        ctx.translate(-x, -y);
    }
};