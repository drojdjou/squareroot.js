/**
 * @class
 *
 * A transform is a basic building block for 3D scenes made with squareroot.js
 * 
 * @param n Optional: the name of the transform.
 */
SQR.Transform = function(n) {

    var that = this;

    this.name = n;
    this.enabled = true;

    /**
     * if set to true, this.position, this.rotation, this.rotationQ and this.scale will be ignored and
     * the this.matrix can be manipulated directly.
     *
     * Default: false.
     */
    this.directMatrixMode = false;

    /**
     * If true, quaternions (this.rotationQ) will be used to calculate the transforms orientation,
     * otherwise the eurler angles will be used (this.rotation)
     *
     * Default: false.
     */
    this.useQuaternion = false;

    /**
     * Renderers defines how an element will be rendered.
     * Ex. a CSS element would typically have SQR.DOMElement2D or SQR.DOMElement3D attached.
     */
    this.renderer = null;

    /**
     * Geometry describes the shape of the element.
     */
    this.geometry = null;

    /**
     * Experimental. A collider defines a hit area for the element
     */
    this.collider = null;

    /**
     * The parent transfom of this transform
     */
    this.parent = null;

    /**
     * The engine, which is also the root element of the transform hierarchy
     */
    this.engine = null;

    /**
     * A 3D vector that describes the position of the transform
     */
    this.position = new SQR.V3();

    /**
     * A 3D vector the describes the rotation of the transform in Euler angles
     */
    this.rotation = new SQR.V3();

    /**
     * A Quaternion that describes the rotation of the transform
     */
    this.rotationQ = new SQR.Quaternion();

    this.scale = new SQR.V3(1, 1, 1);

    var _globalPosition = new SQR.V3();

    this.matrix = new SQR.Matrix44();
    this.globalMatrix = new SQR.Matrix44();
    this.viewMatrix = new SQR.Matrix44();
    this.normalMatrix = new SQR.Matrix33();
    this.inverseWorldMatrix = new SQR.Matrix44();

    this.forward = new SQR.V3();
    this.left = new SQR.V3();
    this.top = new SQR.V3();

    // 0 - dynamic object
    // 1 - static object
    // 2 - static object after matrices were calculated
    this.positioningMode = 0;

    this.depth = function() {
        return this.viewMatrix.data[14]; // t.z
    }

    /**
     * The array of all child transforms
     */
    this.children = [];

    /**
     * Same as this.children.length but faster
     */
    this.numChildren = 0;

    /**
     * Add a child transform. Accepts multiple arguments but all of them need to be of type SQR.Transform
     *
     * It doesn't do any sort of type checking so if you add non object that are not SQR.Transforms
     * it can result in errors when the scene is rendered.
     */
    this.add = function() {
        for (var i = 0; i < arguments.length; i++) {
            var t = arguments[i];
            t.parent = this;
            if (this.children.indexOf(t) == -1) this.children.push(t);
        }
        this.numChildren = this.children.length;
    }
    /**
     * Remove a child transform. Accepts multiple arguments but all of them need to be of type SQR.Transform
     */
    this.remove = function() {
        for (var i = 0; i < arguments.length; i++) {
            var t = arguments[i];
            var j = this.children.indexOf(t);

            if (j == -1) return false;

            t.parent = null;

            if (t.renderer && (t.renderer.isDom2d || t.renderer.isDom3d)) {
                t.renderer.removeFromDom();
            }


            this.children.splice(j, 1);
        }

        this.numChildren = this.children.length;
    }

    /**
     * Check if transform is child of this transfom
     * @param t the SQR.Transfom to check
     */
    this.contains = function(t) {
        return this.children.indexOf(t) > -1;
    }

    /**
     * Execute this function on all the child transforms including this current one
     * @param f
     */
    this.recurse = function(f) {
        f(this);
        for (var i = 0; i < this.numChildren; i++) {
            this.children[i].recurse(f);
        }
    }

    /**
     * Remove all child transforms.
     *
     * If any of the child transforms have a hierarchy of it's own it will not be modified.
     */
    this.removeAll = function() {
        for (var i = 0; i < this.numChildren; i++) {
            var t = this.children[i];
            t.parent = null;

            if (t.renderer && (t.renderer.isDom2d || t.renderer.isDom3d)) {
                t.renderer.removeFromDom();
            }
        }

        this.children = [];
        this.numChildren = this.children.length;
    }

    /**
     * Sets up the local matrix and multiplies is by the parents globalMatrix.
     * This function is called in the rendering process, do not call directly.
     */
    this.transformWorld = function() {

        if (this.positioningMode == 2) return;

        if (!this.directMatrixMode) {

            var p = this.position;
            var q = this.rotationQ;
            var r = this.rotation;
            var s = this.scale;

            if (this.useQuaternion)
                this.matrix.setTQS(p.x, p.y, p.z, q.w, q.x, q.y, q.z, s.x, s.y, s.z);
            else
                this.matrix.setTRS(p.x, p.y, p.z, r.x, r.y, r.z, s.x, s.y, s.z);
        }

        if (this.lookDirection) {
            this.matrix.lookAt(this.lookDirection, SQR.V3.up);
            this.matrix.scale(s.x, s.y, s.z);
        }

        if (this.parent) {
            this.parent.globalMatrix.copyTo(this.globalMatrix);
            this.globalMatrix.multiply(this.matrix);
        } else {
            this.matrix.copyTo(this.globalMatrix);
        }

        if (this.lookTarget) {
            this.globalMatrix.lookAt(this.lookTarget.globalPosition(), SQR.V3.up);
        }

        this.globalMatrix.extractPosition(_globalPosition);

        this.globalMatrix.inverseMat3(this.normalMatrix);

        var d = this.normalMatrix.data;

        // this.left.set(d[0], d[1], d[2]);
        // this.top.set(d[3], d[4], d[5]);
        // this.forward.set(d[6], d[7], d[8]);

        this.left.set(      d[0],   d[3],   d[6]);
        this.top.set(       d[1],   d[4],   d[7]);
        this.forward.set(   d[2],   d[5],   d[8]);

        if (this.positioningMode == 1) this.positioningMode = 2;
    }

    /**
     * Position of this transform in global coordinates.
     */
    this.globalPosition = function() {
        return _globalPosition;
    }

    /**
     * Calculate the view matrix.
     *
     * This function is called in the rendering process, do not call directly.
     *
     * @param inverseCamMatrix the inverse matrix of the camera
     */
    this.transformView = function(inverseCamMatrix) {
        inverseCamMatrix.copyTo(this.viewMatrix);
        this.viewMatrix.multiply(this.globalMatrix);
    }

    /**
     * Orient this transform in the direction of another transform
     *
     * @param target SQR.Transform to look at
     */
    this.lookAt = function(target) {
        this.lookTarget = target;
    }

    /**
     * Similar to this.lookAt but takes a 3D vector as argument rather than a SQR.Transfom
     *
     * @param direction SQR.V3 to look at
     */
    this.lookInDirection = function(direction) {
        this.lookDirection = direction;
    }

    /**
     * Calculate the camera inverse matrix.
     *
     * Used only if this transform is a camera.
     *
     * This function is called in the rendering process, do not call directly.
     */
    this.computeInverseMatrix = function() {
        this.globalMatrix.inverse(this.inverseWorldMatrix);
        return this.inverseWorldMatrix;
    }
}
