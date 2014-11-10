SQR.V2 = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.size = 2;
}

SQR.V2.prototype.toUniform = function() {
    return toArray();
}

SQR.V2.prototype.toArray = function() {
    if(!this.array) this.array = new Float32Array(2);
    this.array[0] = this.x;
    this.array[1] = this.y;
    return this.array;
}