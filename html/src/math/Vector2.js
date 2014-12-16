SQR.V2 = function(x, y) {
    this.set(x, y);
    this.size = 2;
}

SQR.V2.prototype.set = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    return this;
}

SQR.V2.prototype.copyTo = function(p) {
    p.x = this.x;
    p.y = this.y;
    return p;
}

SQR.V2.prototype.copyFrom = function(p) {
    this.x = p.x;
    this.y = p.y;
    return this;
}

SQR.V2.prototype.clone = function() {
    return new SQR.V2(this.x, this.y);
}

SQR.V2.prototype.magsq = function() {
    return this.x * this.x + this.y * this.y;
};

SQR.V2.prototype.mag = function() {
    return Math.sqrt(this.magsq());
};

SQR.V2.prototype.isZero = function() {
    return this.x == 0 && this.y == 0;
};

SQR.V2.prototype.mul = function(s) {
    this.x *= s;
    this.y *= s;
    return this;
}

SQR.V2.prototype.neg = function() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
}

SQR.V2.prototype.norm = function() {
    var m = 1 / this.mag();
    this.set(this.x * m, this.y * m);
    return this;
}

/**
 * a.add(a, b).add(a, c) -> a + b + c
 *
 * @param a
 * @param b
 */
SQR.V2.prototype.add = function(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    return this;
}

/**
 * a.sub(b, a) ->  a = from a to b
 *
 * @param a
 * @param b
 */
SQR.V2.prototype.sub = function(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    return this;
}

SQR.V2.prototype.lerp = function(a, b, t) {
    this.x = a.x + (b.x - a.x) * t;
    this.y = a.y + (b.y - a.y) * t;
    return this;
}

SQR.V2.dot = function(a, b) {
    return (a.x * b.x + a.y * b.y)
}

SQR.V2.prototype.perp = function() {
    this.set(this.y, -this.x);
    return this;
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