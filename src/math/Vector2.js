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


SQR.V2.prototype.mul = function(s) {
    this.x *= s;
    this.y *= s;
    return this;
}

SQR.V2.prototype.magsq = function() {
    return this.x * this.x + this.y * this.y;
}

SQR.V2.prototype.mag = function() {
    return Math.sqrt(this.magsq());
}

SQR.V2.prototype.norm = function() {
    var m = this.mag();
    if(m == 0) return this;
    this.x /= m
    this.y /= m;
    return this;
}

/**
 * Subtracts this vector from v. Used to get a vector going from current to v.
 * In order to limit creation of new objects pass en existing vector as 2nd argument.
 *
 * @param v the vector to subtract from the current vector
 * @param r the resulting vector, if omitted, new vector is returned
 * @returns the resulting vector
 */
SQR.V2.prototype.sub = function(v, r) {
    r = r || new SQR.V2();
    r.x = v.x - this.x;
    r.y = v.y - this.y;
    return r;
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

SQR.V2.prototype.addc = function(x ,y) {
    this.x += x;
    this.y += y;
    return this;
}

SQR.V2.prototype.addAngleRadius = function(a, r) {
    this.x += Math.cos(a) * r;
    this.y += Math.sin(a) * r;
    return this;
}