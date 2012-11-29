SQR.V2 = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

/**
 * Set the vector to the given values
 *
 * @param x x component
 * @param y y component
 */
SQR.V2.prototype.set = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    return this;
}

SQR.V2.prototype.copyTo = function(v) {
    v.x = this.x;
    v.y = this.y;
    // Don't return anything - it's can be dangerous
}

SQR.V2.prototype.copyFrom = function(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
}

/**
 * Adds two vectors. Vectors can be recylced to avoid creating vec vectors like this:
 *
 * a.sum(a, b);
 *
 * Since this method returns the current instance, method calls can be chained:
 *
 * a.sum(a, b).sum(a, c) means: a + b + c
 *
 * @param a a vector
 * @param b another vector
 * @param c an optional 3rd vector to store the
 * @returns this vector
 */
SQR.V2.prototype.add = function(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    return this;
}


SQR.V2.prototype.neg = function() {
    this.x *= -1;
    this.y *= -1;
    return this;
}

SQR.V2.prototype.addTo = function(a) {
    this.x += a.x;
    this.y += a.y;
    return this;
}


SQR.V2.prototype.mul = function(s, v) {
    v = v || this;
    v.x = this.x * s;
    v.y = this.y * s;
    return v;
}

SQR.V2.prototype.magsq = function() {
    return this.x * this.x + this.y * this.y;
}

SQR.V2.prototype.mag = function() {
    return Math.sqrt(this.magsq());
}

SQR.V2.prototype.norm = function() {
    var m = this.mag();
    if (m == 0) return this;
    this.x /= m
    this.y /= m;
    return this;
}

/**
 * Subtracts b from a and stores the result in this vector
 */
SQR.V2.prototype.sub = function(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    return this;
}

SQR.V2.prototype.perpendicular = function(a, b) {
    var tx = this.x, ty = this.y;
    this.x = -ty
    this.y = tx
    return this;
}

/**
 * @returns true if it's a zero vector
 */
SQR.V2.prototype.isZero = function() {
    return this.x == 0 && this.y == 0;
}

/**
 * @returns a random vector where x and y are in range [-1, 1]
 */
SQR.V2.random = function() {
    return new SQR.V2(Math.random() * 2 - 1, Math.random() * 2 - 1);
}


SQR.V2.prototype.setAngleRadius = function(a, r) {
    this.x = Math.cos(a) * r;
    this.y = Math.sin(a) * r;
    return this;
}

SQR.V2.prototype.addc = function(x, y) {
    this.x += x;
    this.y += y;
    return this;
}

SQR.V2.prototype.addAngleRadius = function(a, r) {
    this.x += Math.cos(a) * r;
    this.y += Math.sin(a) * r;
    return this;
}

SQR.V2.dot = function(a, b) {
    return (a.x * b.x + a.y * b.y)
}