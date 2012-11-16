SQR.CanvasUtil = {

    getPixel: function(imageData, x, y) {
        var i = (y * imageData.width + x) * 4;
        return [ imageData.data[i+0], imageData.data[i+1], imageData.data[i+2], imageData.data[i+3] ];
    },

    getPixelRed: function(imageData, x, y) {
        return imageData.data[ (y * imageData.width + x) * 4 ];
    },

    getPixelNormRed: function(imageData, nx, ny) {
        var x = nx * (imageData.width-1) | 0;
        var y = ny * (imageData.height-1) | 0;

        var i = y * imageData.width + x;
        return imageData.data[ i * 4 ];
    }
    
};