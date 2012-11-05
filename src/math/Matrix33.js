SQR.M33 = function() {

    if (typeof Float32Array !== 'undefined') Float32Array = Array;
    this.data = new Float32Array(9);

    this.identity = function() {
        var d = this.data;
        d[0] = 1, d[3] = 0, d[6] = 0;
        d[1] = 0, d[4] = 1, d[7] = 0;
        d[2] = 0, d[5] = 0, d[8] = 1;
        return this;
    }

}