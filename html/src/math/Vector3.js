/**
 *  @class V3
 *  @memberof SQR
 *
 *  @descrption A 3-dimensional vector
 *
 */
SQR.V3 = function(x, y, z, w, i) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 1;
    this.size = 3;
}

SQR.V3.prototype.set = function(x, y, z, w) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 1;
    return this;
}

SQR.V3.prototype.copyTo = function(p) {
    p.x = this.x;
    p.y = this.y;
    p.z = this.z;
    p.w = this.w;
    return p;
}

SQR.V3.prototype.copyFrom = function(p) {
    this.x = p.x;
    this.y = p.y;
    this.z = p.z || 0; // in case p is SQR.V2
    this.w = (p.w !== undefined) ? p.w : 1;
    return this;
}

SQR.V3.prototype.clone = function() {
    return new SQR.V3(this.x, this.y, this.z);
}

SQR.V3.prototype.magsq = function() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
};

SQR.V3.prototype.mag = function() {
    return Math.sqrt(this.magsq());
};

SQR.V3.prototype.isZero = function() {
    return this.x == 0 && this.y == 0 && this.z == 0;
};

SQR.V3.prototype.mul = function(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
}

SQR.V3.prototype.neg = function() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
}

SQR.V3.prototype.norm = function() {
    var m = 1 / this.mag();
    this.set(this.x * m, this.y * m, this.z * m);
    return this;
}

/**
 * a.add(a, b).add(a, c) -> a + b + c
 *
 * @param a
 * @param b
 */
SQR.V3.prototype.add = function(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;
    return this;
}

/**
 * a.sub(b, a) ->  a = from a to b
 *
 * @param a
 * @param b
 */
SQR.V3.prototype.sub = function(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
}

SQR.V3.prototype.lerp = function(a, b, t) {
    this.x = a.x + (b.x - a.x) * t;
    this.y = a.y + (b.y - a.y) * t;
    this.z = a.z + (b.z - a.z) * t;
    return this;
}

SQR.V3.prototype.random = function() {
    this.x = Math.random() * 2 - 1;
    this.y = Math.random() * 2 - 1;
    this.z = Math.random() * 2 - 1;
    return this;
}

SQR.V3.dot = function(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

SQR.V3.prototype.cross = function(a, b) {
    var x = a.y * b.z - a.z * b.y;
    var y = a.z * b.x - a.x * b.z;
    var z = a.x * b.y - a.y * b.x;
    this.set(x, y, z, this.w);
    return this;
}

SQR.V3.prototype.toUniform = function() {
    return this.toArray();
}

SQR.V3.prototype.toArray = function() {
    if(!this.array) this.array = new Float32Array(3);
    this.array[0] = this.x;
    this.array[1] = this.y;
    this.array[2] = this.z; 
    return this.array;
}

/**
 *  Assuming the vector was projected using the SQR.ProjectionMatrix, use this
 *  to calculate it's screen space. (useful for software rendering, ex. on canvas 2d)
 */
SQR.V3.prototype.toScreenSpace = function(w, h) {
    w = w || window.innerWidth;
    h = h || window.innerHeight;
    this.x = (this.x / this.z) * w/2 + w/2;
    this.y = (this.y / this.z) * h/2 + h/2;
}

/**
 *  Use this for caculating per-vertex normals
 */
SQR.V3.prototype.addNormal = function(_n) {

    if(!this.normal) {
        this.normal = new SQR.V3();
    }

    this.normal.add(this.normal, _n);
}

SQR.V3.prototype.resetNormal = function(_n) {
    if(this.normal) this.normal.set();
}


SQR.V3.up = new SQR.V3(0,1,0);
SQR.V3.forward = new SQR.V3(0,0,1);

SQR.V3.__tv1 = new SQR.V3();
SQR.V3.__tv2 = new SQR.V3();
SQR.V3.__tv3 = new SQR.V3();