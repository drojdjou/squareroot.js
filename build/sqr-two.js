/* --- --- [two/CanvasRenderer.js] --- --- */

SQR.CanvasRenderer = function(canvas) {

	var r = {};

	var BADCTX = "> SQR.Context - Invalid canvas reference.";

	if(!canvas) canvas = document.createElement('canvas');
	if(!(canvas instanceof HTMLElement)) canvas = document.querySelector(canvas);
	if(!canvas.getContext) throw BADCTX;

	var ctx = canvas.getContext('2d');

	r.canvas = canvas;

	r.setSize = function(w, h) {
		canvas.width = w;
		canvas.height = h;
	}

	r.render = function(root) {
		ctx.clearRect(0, 0, w, h)
		root.draw(ctx);
	}

	return r;
}

/* --- --- [two/Transform2d.js] --- --- */

SQR.Transform2d = function() {

	var t = {};

	t.name = name || 'sqr.transform.' + SQR.Transform2dCount++;

	// z used az in z-ijndex
	t.position = new SQR.V3(0, 0, 0);
	t.rotation = 0
	t.scale = new SQR.V2(1, 1);

	t.children = [], t.numChildren = 0;

    t.add = function() {
        for (var i = 0; i < arguments.length; i++) {
            var c = arguments[i];
            c.parent = t;
            if (t.children.indexOf(c) == -1) t.children.push(c);
        }
        t.numChildren = t.children.length;
        return t;
    }

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

    t.contains = function(c) {
        return t.children.indexOf(c) > -1;
    }

    t.recurse = function(f, excludeSelf) {
       if(!excludeSelf) f(t);
        for (var i = 0; i < t.numChildren; i++) {
            t.children[i].recurse(f);
        }
    }

    t.draw = function(context) {

    	context.save();
    	context.translate(t.position.x, t.position.y);
    	context.rotate(t.rotation);
    	context.scale(t.scale.x, t.scale.y);

    	if(t.shape) t.shape(context);
    	for(var i = 0; i < t.numChildren; i++) t.children[i].draw(context);

    	context.restore();
	}

	return t;
}

SQR.Transform2dCount = 0;









