/**
 *  @class Transform
 *  @memberof SQR
 *
 *  @description A transform is a basic building block for 3D scenes made with squareroot.js
 * 
 *  @param name {string} the name of the transform.
 */
SQR.Transform = function(name, uid) {

	if(!(this instanceof SQR.Transform)) return new SQR.Transform(name, uid);

	var t = this;

	t._transformState = 0;

	t.uid = uid;

	/**
	 *  @var {string} name - a unique name of this transform, useful for debugging
	 *  @memberof SQR.Transform.prototype
	 *  @default `sqr.transform.` + a counter (ex. `sqr.transform.29)
	 */
	t.name = name || 'sqr.transform.' + SQR.TransformCount++;

	/** 
	 *  @var {boolean} active - is set to false, the transform and 
	 *  all it's children will not be rendered.
	 *  @memberof SQR.Transform.prototype
	 *  @default false
	 */
	t.active = true;

	/**
	 *  @var {boolean} directMatrixMode - if set to true, position, rotation/quaternion and scale will be ignored
	 *  @memberof SQR.Transform.prototype
	 *
	 *  @description When set to true matrix value inside @this.matrix can be manipulated directly.
	 *
	 *  @default false
	 */
	t.directMatrixMode = false;
	

	/** 
	 *  @var {SQR.Matrix44} matrix - object-to-parent transformation matrix
	 *  @memberof SQR.Transform.prototype
	 */
	t.matrix = new SQR.Matrix44();
	
	/** 
	 *  @var {SQR.V3} position - the position of this transform relative to it's parent
	 *  @memberof SQR.Transform.prototype
	 */
	t.position = new SQR.V3();

	/** 
	 *  @readonly 
	 *  @var {SQR.V3} globalPosition - the global position of this transform (set automatically)
	 *  @memberof SQR.Transform.prototype
	 */
	t.globalPosition = new SQR.V3();

	/** 
	 *  @readonly 
	 *  @var {SQR.V3} forward - the forward vector 
	 *  @memberof SQR.Transform.prototype
	 */
	t.forward = new SQR.V3();

	/**
	 *  @var {SQR.Quaternion} quaternion - A Quaternion that describes the rotation of the transform, 
	 *  only active if `useQuaternion` is set to true.
	 *  @memberof SQR.Transform.prototype
	 */
	t.quaternion = new SQR.Quaternion();

	/**
	 *  @var {SQR.V3} rotation - A 3D vector the describes the rotation of the transform in Euler angles, 
	 *  disabled if `useQuaternion` is set to true.
	 *  @memberof SQR.Transform.prototype
	 */
	t.rotation = new SQR.V3();

	/**
	 *  @var {SQR.V3} scale - the scale of the object on x, y and z axis
	 *  @memberof SQR.Transform.prototype
	 */
	t.scale = new SQR.V3(1, 1, 1);

	/**
	 *  @var {SQR.Quaternion} useQuaternion - if set to true, 
	 *  will use `quaternion` for rotation instead of the Euler angles in `rotation`
	 *  @memberof SQR.Transform.prototype
	 *  @default false
	 */
	t.useQuaternion = false;

	/**
	 *  @var {boolean} isStatic
	 *  @description Any object can have two different positioning modes: dynamic or static.
	 *  If this value is set to false (dynamic) the matrices 
	 *  for this object will be recalculated at each frame.<br>
	 *  If this value is set to true (static) the matrices for 
	 *  this object will be recalculated only once.
	 *  @memberof SQR.Transform.prototype
	 *  @default false
	 */
	t.isStatic = false;

	
	t.normalMatrix = new SQR.Matrix33();
	t.globalMatrix = new SQR.Matrix44();
	t.viewMatrix = new SQR.Matrix44();
	t.inverseWorldMatrix;

	t.boneMatrix = new SQR.Matrix44();
	t.poseMatrix = new SQR.Matrix44();
	t.inversePoseMatrix = new SQR.Matrix44();

	t.lookAt = null;

	t.transparent = false;
	t.srcFactor = null;
	t.dstFactor = null;
	t.useDepth = true;
	t.depthMask = true;
	t.lineWidth = 1;

	t.children = [], t.numChildren = 0;

}

SQR.Transform.prototype.setAsBoneRoot = function() {
	this.computePoseMatrix();
}

SQR.Transform.prototype.computePoseMatrix = function() {

	var t = this;

	t.bone = true;
	t.transformWorld();

	if(!(t.parent && t.parent.bone)) {
		t.matrix.copyTo(t.poseMatrix);
	} else {
		t.parent.poseMatrix.copyTo(t.poseMatrix);
		t.poseMatrix.multiply(t.matrix);
	}

	for(var i = 0; i < t.numChildren; i++) {
		var c = t.children[i];
		c.computePoseMatrix();
	}

	t.poseMatrix.inverse(t.inversePoseMatrix);

	return t;
}

SQR.Transform.prototype.setBlending = function(transparent, src, dst) {
	this.transparent = transparent;
	// By default blend the object on top with the object on the bottom
	this.srcFactor = src || SQR.gl.SRC_ALPHA;
	this.dstFactor = dst || SQR.gl.ONE_MINUS_SRC_ALPHA;
} 



/**
*   @method add
*   @memberof SQR.Transform.prototype
*   
*   @description Add a child transform. Accepts multiple arguments but all of them need to be of type {SQR.Transform}.
*   It doesn't do any sort of type checking so if you add non object that are not {SQR.Transform} 
*   it will result in errors when the scene is rendered.
*/
SQR.Transform.prototype.add = function() {
	var t = this;
	for (var i = 0; i < arguments.length; i++) {
		var c = arguments[i];

		if(c.parent) { c.parent.remove(c); }
		if(c.onAdd) c.onAdd(t);

		c.parent = t;
		if (t.children.indexOf(c) == -1) t.children.push(c);
	}
	t.numChildren = t.children.length;
	return t;
}

/**
 *  @method remove
 *  @memberof SQR.Transform.prototype
 *   
 *  @description Removes a child transform. Accepts multiple arguments 
 *  but all of them need to be of type {SQR.Transform}
 */
SQR.Transform.prototype.remove = function() {
	var t = this;
	for (var i = 0; i < arguments.length; i++) {
		var c = arguments[i];
		var j = t.children.indexOf(c);
		if (j == -1) continue;
		c.parent = null;
		t.children.splice(j, 1);
		if(c.onRemove) c.onRemove(t);
	}
	t.numChildren = t.children.length;
	return t;
}

/**
 *  @method removeAll
 *  @memberof SQR.Transform.prototype
 *   
 *  @description Removes all children transform.
 */
SQR.Transform.prototype.removeAll = function() {
	this.children.length = 0;
	this.numChildren = 0;
}

/**
 *  @method contains
 *  @memberof SQR.Transform.prototype
 *   
 *  @description Checks if transform is child of this transfom
 *  @param {SQR.Transform} c the transform to look for
 */
SQR.Transform.prototype.contains = function(c) {
	return this.children.indexOf(c) > -1;
}

/**
 *  @method recurse
 *  @memberof SQR.Transform.prototype
 *   
 *  @description Execute this function on all the child transforms.
 *
 *  @param {function} f the function that will be called on each child. 
 *  This function will receive the transform as argument.
 *
 *  @param {boolean} excludeSelf if set to true, the function will only be called for all 
 *  the ancestors of the Transform, not on the transform itself.
 */
SQR.Transform.prototype.recurse = function(f, excludeSelf) {
   if(!excludeSelf) f(this);
	for (var i = 0; i < this.numChildren; i++) {
		this.children[i].recurse(f);
	}
}

SQR.Transform.prototype.findByName = function(name) {
	var found;
	this.recurse(function(c) {
		if(c.name == name) {
			found = c;
			return null;
		}
	});
	return found;
}

SQR.Transform.prototype.findById = function(id) {
	var found;
	this.recurse(function(c) {
		if(c.uid && c.uid == id) {
			found = c;
			return null;
		}
	});
	return found;
}

SQR.Transform.prototype.findByPath = function(path) {
	var p = path.split('/');
	var c = this;
	while(pp = p.shift()) {
		if(!c) return;
		c = c.findByName(pp);
	}
	return c;
}

SQR.Transform.prototype.draw = function(options) {
	var t = this;

	var isReplacementShader = options && options.replacementShader;
	var shader = isReplacementShader ? options.replacementShader : t.shader;

	shader.setUniform('uMatrix', t.globalMatrix);
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

	// This works, but this is much better:
	// http://stackoverflow.com/questions/2859722/opengl-how-can-i-put-the-skybox-in-the-infinity (implement globally)
	var gl = SQR.gl;

	// gl.depthMask(t.useDepth);
	t.useDepth ? gl.enable(gl.DEPTH_TEST) : gl.disable(gl.DEPTH_TEST);

	gl.depthMask(t.depthMask);

	gl.lineWidth(t.lineWidth);
	t.buffer.draw(this);
	if(t.afterDraw) t.afterDraw();
}

/**
 * Sets up the local matrix and multiplies is by the parents globalMatrix.
 * This function is called in the rendering process, do not call directly.
 */
SQR.Transform.prototype.transformWorld = function() {
	var t = this;

	if(t._transformState == 1) return;

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

	if(t.lookAt) {
		t.matrix.lookAt(t.lookAt.position);
		// Look at erases scale so let's put that back in
		t.matrix.scale(s.x, s.y, s.z);
	}

	if (t.parent) {
		t.parent.globalMatrix.copyTo(t.globalMatrix);
		t.globalMatrix.multiply(t.matrix);

		if(t.bone) {
			t.parent.boneMatrix.copyTo(t.boneMatrix);
			t.boneMatrix.multiply(t.matrix);
		}

	} else {
		t.matrix.copyTo(t.globalMatrix);
		if(t.bone) t.matrix.copyTo(t.boneMatrix);
	}

	var g = t.globalMatrix;

	g.extractPosition(t.globalPosition);
	t.forward.set(g.data[8], g.data[9], g.data[10]);

	if(t.isStatic) t._transformState = 1;
	if(t.beforeDraw) t.beforeDraw(t);
}

/** 
 *  Used for sorting objects in the rendering function
 *  (not implemented yet)
 */
SQR.Transform.prototype.viewDepth = function() {
	return this.viewMatrix.data[14];
}

/**
 * Calculate the view matrix.
 *
 * This function is called in the rendering process, do not call directly.
 *
 * @param inverseCamMatrix {SQR.Matrix44} the inverse matrix of the camera
 */
SQR.Transform.prototype.transformView = function(inverseCamMatrix) {
	var t = this;
	if(inverseCamMatrix) {
		inverseCamMatrix.copyTo(t.viewMatrix);
		t.viewMatrix.multiply(t.globalMatrix);

		// it used to be viewMatrix instead, but this was (probably) wrong
		t.globalMatrix.inverseMat3(t.normalMatrix);

	} else {
		t.globalMatrix.copyTo(t.viewMatrix);
		t.globalMatrix.inverseMat3(t.normalMatrix);
	}
	
}

/**
 * Calculate the camera inverse matrix.
 *
 * Used only if this transform is a camera.
 *
 * This function is called in the rendering process, do not call directly.
 */
SQR.Transform.prototype.computeInverseMatrix = function() {
	var t = this;
	if(!t.inverseWorldMatrix) {
		t.inverseWorldMatrix = new SQR.Matrix44();
	}
	t.globalMatrix.inverse(t.inverseWorldMatrix);
	return t.inverseWorldMatrix;
}

SQR.Transform.prototype.computeBoneMatrix = function() {
	var t = this;
	t.boneMatrix.multiply(t.inversePoseMatrix);
	return t.boneMatrix;
}


SQR.TransformCount = 0;






