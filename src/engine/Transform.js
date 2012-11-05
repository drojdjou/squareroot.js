SQR.Transform = function(n) {

    this.name = n;
    this.directMatrixMode = false;

    this.renderer = null;
    this.geometry = null;
    this.parent = null;
    this.engine = null;

    this.position = new SQR.V3();
    this.rotation = new SQR.V3();
    this.scale = new SQR.V3(1, 1, 1);

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

    this.removeAll = function() {
        this.children = [];
        this.numChildren = this.children.length;
    }

    this.transformWorld = function() {

        if (!this.directMatrixMode) {
            var p = this.position;
            var r = this.rotation;
            var s = this.scale;
            this.matrix.setTRS(p.x, p.y, p.z, r.x, r.y, r.z, s.x, s.y, s.z);
        }

        if (this.lookDirection) {
            this.matrix.lookAt(this.lookDirection, SQR.V3.up);
//            this.matrix.transpose();
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
    }

    var _globalPosition = new SQR.V3();

    this.globalPosition = function() {
        var d = this.globalMatrix.data;
//        console.log("Global position: ", d[12],d[13], d[14]);
        _globalPosition.set(d[12],d[13], d[14]);
        return _globalPosition;
    }

    this.transformView = function(v) {
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

//        console.log("1. Matrix before inverse");
//        console.log(SQR.Stringify.m44(this.globalMatrix));

//        console.log("2: Determinant " + this.worldMatrix.determinant());
        this.globalMatrix.copyTo(this.inverseWorldMatrix);
        this.inverseWorldMatrix.transpose();
        this.inverseWorldMatrix.inverse();

//        console.log("3: Inverse matrix");
//        console.log(SQR.Stringify.m44(this.inverseWorldMatrix));

        //this.inverseWorldMatrix.transpose();

//        console.log("4: Inverse transposed matrix");
//        console.log(SQR.Stringify.m44(this.inverseWorldMatrix));

        return this.inverseWorldMatrix;
    }
}
