/* --- --- [two/CanvasRenderer.js] --- --- */

/**
 *  @class CanvasRenderer
 *  @memberof SQR
 *
 *  @description Part of a minimal Canvas 2d rendering engine. The paremeter is a canvas element or a selector (ex. #gl-canvas) 
 *	can be passed to this function. If omitted a new canvas element will be created
 *	and it will be available as the canvas property of the object.
 *
 *	@param {HTMLCanvasElement} the underlying canvas element
 *	@property {HTMLCanvasElement} the underlying canvas element
 */
SQR.CanvasRenderer = function(canvas) {

	var r = {};

	var BADCTX = "> SQR.Context - Invalid canvas reference.";

	if(!canvas) canvas = document.createElement('canvas');
	if(!(canvas instanceof HTMLElement)) canvas = document.querySelector(canvas);
	if(!canvas.getContext) throw BADCTX;

	var ctx = canvas.getContext('2d');

	r.canvas = canvas;

	/** 
	 *	Set the size of the underlying canvas element.
	 *	@method setSize
	 *	@memberof SQR.CanvasRenderer.prototype
	 *	@param {Number} w - the width of the canvas
	 *	@param {Number} h - the height of the canvas
	 */
	r.setSize = function(w, h) {
		canvas.width = w;
		canvas.height = h;
	}

	/**
	 *	Render the transform tree
	 *	@method render
	 *	@memberof SQR.CanvasRenderer.prototype
	 *	@param {SQR.Transform2d} root - the root transform to render
	 */
	r.render = function(root) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		root.draw(ctx);
	}

	return r;
}

/* --- --- [two/Transform2d.js] --- --- */

/**
 *  @class Transform2d
 *  @memberof SQR
 *
 *  @description Similar to {SQR.Transform} but specialized to work with 2d rendeirng on a 2d canvas element.
 *  
 */
SQR.Transform2d = function() {

	var t = {};

	t.name = name || 'sqr.transform.' + SQR.Transform2dCount++;

    /** 
     *  @var {SQR.V3} position - the position of this transform relative to it's parent.
     *  It's a 3d vector, because z is used for depth indexing.
     *  @memberof SQR.Transform2d.prototype
     */
	t.position = new SQR.V3(0, 0, 0);

    /**
     *  @var {SQR.V3} rotation - the rotation of the transform in radians
     *  @memberof SQR.Transform2d.prototype
     */
	t.rotation = 0;

    /**
     *  @var {SQR.V2} scale - the scale of the object on x and y axis
     *  @memberof SQR.Transform2d.prototype
     */
	t.scale = new SQR.V2(1, 1);

    /**
     *  @var {Number} alpha - the transparency of this element. 
     *  0 = transparent, 1 = opaque, default 1
     */
    t.alpha = 1;

	t.children = [], t.numChildren = 0;

   /**
    *   @method add
    *   @memberof SQR.Transform2d.prototype
    *   
    *   @description Add a child transform. Accepts multiple arguments but all of them need to be of type {SQR.Transform2D}.
    *   It doesn't do any sort of type checking so if you add non object that are not {SQR.Transform2D} 
    *   it will result in errors when the scene is rendered.
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
     *  @method remove
     *  @memberof SQR.Transform2d.prototype
     *   
     *  @description Removes a child transform. Accepts multiple arguments 
     *  but all of them need to be of type {SQR.Transform2D}
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

    /**
     *  @method removeAll
     *  @memberof SQR.Transform2d.prototype
     *   
     *  @description Removes all children transform.
     */
    t.removeAll = function() {
        t.children.length = 0;
        t.numChildren = 0;
    }

    /**
     *  @method contains
     *  @memberof SQR.Transform2d.prototype
     *   
     *  @description Checks if transform is child of this transfom
     *  @param {SQR.Transform2D} c the transform to look for
     */
    t.contains = function(c) {
        return t.children.indexOf(c) > -1;
    }

    /**
     *  @method recurse
     *  @memberof SQR.Transform2d.prototype
     *   
     *  @description Execute this function on all the child transforms including this current one.
     *
     *  @param {function} f the function that will be called on each child. 
     *  This function will receive the transform as argument.
     *
     *  @param {boolean} excludeSelf if set to true, the function will only be called for all 
     *  the ancestors of the Transform.
     */
    t.recurse = function(f, excludeSelf) {
       if(!excludeSelf) f(t);
        for (var i = 0; i < t.numChildren; i++) {
            t.children[i].recurse(f);
        }
    }

    t.draw = function(context) {
        var c = context;

    	c.save();
    	c.translate(t.position.x, t.position.y);
    	c.rotate(t.rotation);
    	// First draw the children, then self, so that alpha/scale do not affect children
    	for(var i = 0; i < t.numChildren; i++) t.children[i].draw(c);

        if(t.alpha < 1) c.globalAlpha = t.alpha;
        c.scale(t.scale.x, t.scale.y);
        if(t.shape) t.shape(c);

    	c.restore();
	}

	return t;
}

SQR.Transform2dCount = 0;









