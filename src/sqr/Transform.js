SQR.Transform = function(n) {

    var that = this;

    this.name = n;
    this.enabled = true;

    this.directMatrixMode = false;
    this.useQuaternion = false;

    this.renderer = null;
    this.geometry = null;
    this.collider = null;
    this.parent = null;
    this.engine = null;

    this.position = new SQR.V3();
    this.rotation = new SQR.V3();
    this.rotationQ = new SQR.Quaternion();
    this.scale = new SQR.V3(1, 1, 1);

    var _globalPosition = new SQR.V3();

    this.matrix = new SQR.Matrix44();
    this.globalMatrix = new SQR.Matrix44();
    this.viewMatrix = new SQR.Matrix44();
    this.inverseWorldMatrix = new SQR.Matrix44();

    // 0 - dynamic object
    // 1 - static object
    // 2 - static object after matrices were calculated
    this.positioningMode = 0;

    this.depth = function() {
        return this.viewMatrix.data[14]; // t.z
    }

    this.children = [];
    this.numChildren = 0;

    this.add = function() {
        for (var i = 0; i < arguments.length; i++) {
            var t = arguments[i];
            t.parent = this;
            if (this.children.indexOf(t) == -1) this.children.push(t);
        }
        this.numChildren = this.children.length;
    }

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

    this.contains = function(t) {
        return this.children.indexOf(t) > -1;
    }

    this.recurse = function(f) {
        f(this);
        for (var i = 0; i < this.numChildren; i++) {
            this.children[i].recurse(f);
        }
    }

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

        if (this.positioningMode == 1) this.positioningMode = 2;
    }

    this.globalPosition = function() {
        this.globalMatrix.extractPosition(_globalPosition);
        return _globalPosition;
    }

    this.transformView = function(inverseCamMatrix) {
        inverseCamMatrix.copyTo(this.viewMatrix);
        this.viewMatrix.multiply(this.globalMatrix);
    }

    this.lookAt = function(target) {
        this.lookTarget = target;
    }

    this.lookInDirection = function(direction) {
        this.lookDirection = direction;
    }

    this.computeInverseMatrix = function() {
        this.globalMatrix.inverse(this.inverseWorldMatrix);
//        this.inverseWorldMatrix.transpose();
        return this.inverseWorldMatrix;
    }
}
