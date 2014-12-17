// https://raw.githubusercontent.com/drojdjou/squareroot.js/gl/src/core/Transform.js
SQR.Transform = function() {

	var t = {};

	var inverseWorldMatrix;

    t.name = 'sqr.transform.' + SQR.TransformCount++;
    t.active = true;

	t.position = new SQR.V3();
    t.globalPosition = new SQR.V3();
	t.quaternion = new SQR.Quaternion();
	t.rotation = new SQR.V3();
	t.scale = new SQR.V3(1, 1, 1);
	t.useQuaternion = false;

    t.isStatic = false;
    t.directMatrixMode = false;
    var transformState = 0;

	t.matrix = new SQR.Matrix44();
	t.normalMatrix = new SQR.Matrix33();
	t.globalMatrix = new SQR.Matrix44();
    t.viewMatrix = new SQR.Matrix44();
    t.inverseWorldMatrix;

	t.children = [], t.numChildren = 0;

   /**
     * Add a child transform. Accepts multiple arguments but all of them need to be of type {SQR.Transform}
     *
     * It doesn't do any sort of type checking so if you add non object that are not {SQR.Transforms}
     * it will result in errors when the scene is rendered.
     */
    t.add = function() {
        for (var i = 0; i < arguments.length; i++) {
            var c = arguments[i];
            c.parent = t;
            if (t.children.indexOf(c) == -1) t.children.push(c);
        }
        t.numChildren = t.children.length;
        return t;
    }

    /**
     * Remove a child transform. Accepts multiple arguments but all of them need to be of type {SQR.Transform}
     */
    t.remove = function() {
        for (var i = 0; i < arguments.length; i++) {
            var c = arguments[i];
            var j = t.children.indexOf(c);
            if (j == -1) return false;
            c.parent = null;
            t.children.splice(j, 1);
        }
        t.numChildren = t.children.length;
        return t;
    }

    t.removeAll = function() {
        t.children.length = 0;
        t.numChildren = 0;
    }

    /**
     * Check if transform is child of this transfom
     * @param t the {SQR.Transfom} to look for
     */
    t.contains = function(c) {
        return t.children.indexOf(c) > -1;
    }

    /**
     * Execute this function on all the child transforms including this current one
     * @param f the function that will be called on each child. This function will receive the transform as argument.
     */
    t.recurse = function(f) {
        f(t);
        for (var i = 0; i < t.numChildren; i++) {
            t.children[i].recurse(f);
        }
    }

    t.draw = function(options) {
        var isReplacementShader = options && options.replacementShader;
        var shader = isReplacementShader ? options.replacementShader : t.shader;

        shader.setUniform('uMatrix', t.viewMatrix);
        shader.setUniform('uViewMatrix', t.viewMatrix);
        shader.setUniform('uNormalMatrix', t.normalMatrix);

        if(!isReplacementShader && shader.uniforms) {
            var un = Object.keys(shader.uniforms);
            for(var i = 0, l = un.length; i < l; i++) {
                shader.setUniform(un[i], shader.uniforms[un[i]]);
            }
        }

        if(!isReplacementShader && t.uniforms) {
            var un = Object.keys(t.uniforms);
            for(var i = 0, l = un.length; i < l; i++) {
                shader.setUniform(un[i], t.uniforms[un[i]]);
            }
        }

    	t.buffer.draw();
    }

	/**
     * Sets up the local matrix and multiplies is by the parents globalMatrix.
     * This function is called in the rendering process, do not call directly.
     *
     * @private
     */
    t.transformWorld = function() {

        if(transformState == 1) return;

        if(!t.directMatrixMode) {
        	var p = t.position;
            var s = t.scale;
            
            if (t.useQuaternion) {
                var q = t.quaternion;
            	t.matrix.setTQS(p.x, p.y, p.z, q.w, q.x, q.y, q.z, s.x, s.y, s.z);
           	} else {
                var r = t.rotation;
    			t.matrix.setTRS(p.x, p.y, p.z, r.x, r.y, r.z, s.x, s.y, s.z);
            }
        }

        if (t.parent) {
            t.parent.globalMatrix.copyTo(t.globalMatrix);
            t.globalMatrix.multiply(t.matrix);
        } else {
            t.matrix.copyTo(t.globalMatrix);
        }

        t.globalMatrix.extractPosition(t.globalPosition);

        if(t.isStatic) transformState = 1;
    }

    /**
     * Calculate the view matrix.
     *
     * This function is called in the rendering process, do not call directly.
     *
     * @param inverseCamMatrix {SQR.Matrix44} the inverse matrix of the camera
     */
    t.transformView = function(inverseCamMatrix) {
        if(inverseCamMatrix) {
            inverseCamMatrix.copyTo(t.viewMatrix);
            t.viewMatrix.multiply(t.globalMatrix);
            t.viewMatrix.inverseMat3(t.normalMatrix);
        } else {
            t.globalMatrix.copyTo(t.viewMatrix);
            t.viewMatrix.inverseMat3(t.normalMatrix);
        }
        
    }

	/**
     * Calculate the camera inverse matrix.
     *
     * Used only if this transform is a camera.
     *
     * This function is called in the rendering process, do not call directly.
     */
    t.computeInverseMatrix = function() {
    	if(!t.inverseWorldMatrix) {
            t.inverseWorldMatrix = new SQR.Matrix44();
        }
        t.globalMatrix.inverse(t.inverseWorldMatrix);
        return t.inverseWorldMatrix;
    }

	return t;

}

SQR.TransformCount = 0;