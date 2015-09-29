/**
 *  @class V3
 *  @memberof SQR
 *
 *  @descrption A 3-dimensional vector
 *
 */
SQR.V3 = function(x, y, z) {
    this.set(x, y, z)
    this.size = 3;
}

/**
 *  Sets the vector compoment to values. Note that this class has actually 4 not 3 compoments.
 *  @param x - the value of the x compoment
 *  @param y - the value of the y compoment
 *  @param z - the value of the z compoment
 *  @param w - the value of the homogeneous coordinate, defaults to 1 
 *      and leave it that way unless you really know what ypu are doing.
 */ 
SQR.V3.prototype.set = function(x, y, z, w) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 1;
    return this;
}

/**
 *  Copies values from this vector into the p vector
 *
 *  @param {SQR.V2|SQR.V3} p - vector to copy the values to
 */
SQR.V3.prototype.copyTo = function(p) {
    p.x = this.x;
    p.y = this.y;
    if(p.z != undefined) p.z = this.z;
    return p;
}

/**
 *  Copies values from vector p into this vector
 *
 *  @param {SQR.V2|SQR.V3} p - vector to copy the values from
 */
SQR.V3.prototype.copyFrom = function(p) {
    this.x = p.x;
    this.y = p.y;
    this.z = p.z || 0; // in case p is SQR.V2
    return this;
}

/**
 *  Creates and returns a copy of this vector. 
 *  Be careful with this method, because it creates a new object. 
 *  Calling this function repeatedly in a rendering loop can have an adverce impact on performance.
 *
 *  @returns {SQR.V3} a new vector that is a copy of this vector
 */
SQR.V3.prototype.clone = function() {
    return new SQR.V3(this.x, this.y, this.z);
}

/** 
 *  Returns the squared length of this vector. This can be useful to optimize some calculations, since
 *  the actual length requires a squareroot operation (`Math.sqrt()`) 
 *  which can be slow if used on many vectors.
 */
SQR.V3.prototype.magsq = function() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
};

/**
 *  Return the length (magnitude) of this vector
 *  @returns {Number} the length of this vector
 */
SQR.V3.prototype.mag = function() {
    return Math.sqrt(this.magsq());
};

/**
 *  Shorthand to check if this vector is a zero vector 
 *  (i.e. all compoments are very small or equal to 0) The values are compared against SQR.EPSILON
 */
SQR.V3.prototype.isZero = function() {
    return 
        Math.abs(this.x) < SQR.EPSILON && 
        Math.abs(this.y) < SQR.EPSILON && 
        Math.abs(this.z) < SQR.EPSILON;
};

/**
 *  Multiples this vector by a scalar. 
 *  This function can be used in conjunction with {@link SQR.V3#norm} 
 *  to set the vector to a given length `v.norm().mul(10)1 yields a vector of length 10.
 *
 *  @param {Number} s - the value to multiply the the vector by.
 */
SQR.V3.prototype.mul = function(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
}

/**
 *  Negates this vector.
 */
SQR.V3.prototype.neg = function() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
}

/**
 *  Normalizes this vector, i.e. sets its length (magnitude) to 1.
 */
SQR.V3.prototype.norm = function() {
    var m = 1 / this.mag();
    this.set(this.x * m, this.y * m, this.z * m);
    return this;
}

/**
 *  Sets this vector to the sum of a and b. 
 *
 *  @example
a.add(b, c); // a = b + c
a.add(a, b); // a += b
a.add(b);    // alt a += b
a.add(a, b).add(a, c); // = a + b + c
 *
 *  @param {SQR.V3} a
 *  @param {SQR.V3=} b - if omitted the current vector is used, which basically means that a is added to current vector.
 */
SQR.V3.prototype.add = function(a, b) {
    b = b || this;
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

/**
 *  Returns the dot product of a nd b (`a . b`).
 *  @returns {Number} result of a . b
 */
SQR.V3.dot = function(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

/**
 *  Sets this vector to the result of a cross-product of a and b (`a x b`).
 */
SQR.V3.prototype.cross = function(a, b) {
    var x = a.y * b.z - a.z * b.y;
    var y = a.z * b.x - a.x * b.z;
    var z = a.x * b.y - a.y * b.x;
    this.set(x, y, z, this.w);
    return this;
}

/**
 *  @private
 *  @description Alias for toArray
 *
 *  @returns {Float32Array} array - the array holding the values of this vector
 */
SQR.V3.prototype.toUniform = function() {
    return this.toArray();
}

/**
 *  @private
 *  @description Lazily creates a Float32Array and stores 
 *  the components of this vector in the array.
 *  This is mostly used when the value of this vector is 
 *  passed as uniform to a shader
 *  (this function is called internally by the renderer).
 *
 *  @returns {Float32Array} array - the array holding the values of this vector
 */
SQR.V3.prototype.toArray = function() {
    if(!this.array) this.array = new Float32Array(3);
    this.array[0] = this.x;
    this.array[1] = this.y;
    this.array[2] = this.z; 
    return this.array;
}

SQR.V3.prototype.toString = function toString() {
  return x;
}

/**
 *  Assuming the vector was projected using the {@link SQR.ProjectionMatrix}, use this
 *  to calculate it's screen space. (useful for software rendering, ex. on canvas 2d)
 *
 *  @param {Number=} w - the width of the screen (defaults to `window.innerWidth`) 
 *  @param {Number=} h - the height of the screen (defaults to `window.innerHeight`) 
 */
SQR.V3.prototype.toScreenSpace = function(w, h) {
    w = w || window.innerWidth;
    h = h || window.innerHeight;
    this.x = (this.x / this.z) * w/2 + w/2;
    this.y = (this.y / this.z) * h/2 + h/2;

    // TODO: make sure this is ok to be here in any case
    this.y = h - this.y;
}

/**
 *  Use this for caculating per-vertex normals. 
 *  A normal from each contributing face can be added here. 
 *  When all the normals are added, a vector that is the sum of them all 
 *  is available as `this.normal` property. The pre-vertex normal can be caluculated
 *  by normalizing this vector.
 */
SQR.V3.prototype.addNormal = function(_n) {

    if(!this.normal) {
        this.normal = new SQR.V3();
    }

    this.normal.add(this.normal, _n);
}

/** 
 *  This is used to reset the normal to 0,0,0.
 */
SQR.V3.prototype.resetNormal = function(_n) {
    if(this.normal) this.normal.set();
}


/**
 *  @const
 *  @memberof SQR.V3
 *  @description A constant the defines the up vector. 
 *  WARNING: be extremly careful not to modify the values of this vector, because this will cause some
 *  matrix functions, like {@link SQR.Matrix44#lookAt} to not fuction properly.
 */
SQR.V3.up = new SQR.V3(0,1,0);

/**
 *  @const
 *  @memberof SQR.V3
 *  @description A constant the defines the forward vector. 
 *  WARNING: be extremly careful not to modify the values of this vector, because this will cause some
 *  matrix functions to not fuction properly.
 */
SQR.V3.forward = new SQR.V3(0,0,1);

SQR.V3.__tv1 = new SQR.V3();
SQR.V3.__tv2 = new SQR.V3();
SQR.V3.__tv3 = new SQR.V3();