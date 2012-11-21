SQR.Transform = function(n) {

    this.name = n;
    this.directMatrixMode = false;
    this.useQuaternion = false;
    this.cssPreserve3dMode = false;

    this.renderer = null;
    this.geometry = null;
    this.parent = null;
    this.engine = null;

    this.position = new SQR.V3();
    this.rotation = new SQR.V3();
    this.rotationQ = new SQR.Quaternion();
    this.scale = new SQR.V3(1, 1, 1);

    var _globalPosition = new SQR.V3();

    this.matrix = new SQR.Matrix44();
    this.globalMatrix = new SQR.Matrix44();
    this.inverseWorldMatrix = new SQR.Matrix44();

    this.depth = function() {
        return this.globalMatrix.data[14]; // t.z
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

            if(t.renderer && (t.renderer.isDom2d || t.renderer.isDom3d)) {
                t.renderer.removeFromDom();
            }
            

            this.children.splice(j, 1);
        }

        this.numChildren = this.children.length;
    }

    this.contains = function(t) {
        return this.children.indexOf(t) > -1;
    }

    this.removeAll = function() {
        for (var i = 0; i < this.numChildren; i++) {
            var t = this.children[i];
            t.parent = null;

            if(t.renderer && (t.renderer.isDom2d || t.renderer.isDom3d)) {
                t.renderer.removeFromDom();
            }
        }

        this.children = [];
        this.numChildren = this.children.length;
    }

    this.transformWorld = function() {

        this.cssPreserve3dMode = SQR.usePreserve3d
            && this.renderer && this.renderer.isDom3d
            && this.parent && this.parent.renderer && this.parent.renderer.isDom3d;

        if (!this.directMatrixMode) {

            var p = this.position;
            var q = this.rotationQ;
            var r = this.rotation;
            var s = this.scale;

            if(this.useQuaternion)
                this.matrix.setTQS(p.x, p.y, p.z, q.w, q.x, q.y, q.z, s.x, s.y, s.z);
            else
                this.matrix.setTRS(p.x, p.y, p.z, r.x, r.y, r.z, s.x, s.y, s.z);
        }

        if (this.lookDirection) {
            this.matrix.lookAt(this.lookDirection, SQR.V3.up);
        }

        if (this.parent && !this.cssPreserve3dMode) {
            this.parent.globalMatrix.copyTo(this.globalMatrix);
            this.globalMatrix.multiply(this.matrix);
        } else {
            this.matrix.copyTo(this.globalMatrix);
        }

        if (this.lookTarget) {
            this.globalMatrix.lookAt(this.lookTarget.globalPosition(), SQR.V3.up);
        }
    }

    this.globalPosition = function() {
        this.globalMatrix.extractPosition(_globalPosition);
        return _globalPosition;
    }

    this.transformView = function(v) {
        if(this.cssPreserve3dMode) return;
        this.globalMatrix.copyTo(this.matrix);
        v.copyTo(this.globalMatrix);
        this.globalMatrix.multiply(this.matrix);
    }

    this.lookAt = function(target) {
        this.lookTarget = target;
    }

    this.lookInDirection = function(direction) {
        this.lookDirection = direction;
    }

    this.computeInverseMatrix = function() {
        this.globalMatrix.inverse(this.inverseWorldMatrix);
        return this.inverseWorldMatrix;
    }
}
