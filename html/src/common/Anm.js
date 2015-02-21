/**
 *	@namespace Anm
 *  @memberof SQR
 *
 *  @description A tiny Javascript based animation engine.
 */
SQR.Anm = (function() {

	var anm = {};
	var runnersCreated = 0;
	var runners = [], numRunners = 0, spareRunners = [];
	var timePadding = 0, lastTime;

	var now = function() {
		return new Date().getTime();
	};

	// Default interpolation, instead of linear
	var smoothStep = function(t) {
        return (3 * t * t - 2 * t * t * t);
    };

	var clamp01 = function(t) {
		if(t >= 1) return 1;
		if(t <= 0) return 0;
		else return t;
	};

	/** 
	 *	@class Tween
	 *	@memberof SQR
	 *
	 *	@description Object that represents an tween (i.e. an animation applied to an object). 
	 *	It can not be created directly, but is returned by {@link SQR.Animation.run()} (see example below).
	 *	
 	 *	@example
var fadeIn = SQR.Anm.create(500, { alpha: 1 });
var object = { alpha: 0 };
var tween = fadeIn.run(object); // <- instance of SQR.Tween!
 	 */
	var Tween = function() {

		var me = this;
		var obj, properties, duration, delay, durationWithDelay, ease;
		var localProps = [], numLocalProps;
		var update, end, stared, st;

		me.setup = function(o, d, anim) {
			obj = o;
			delay = d;
			properties = anim.properties;
			duration = anim.duration; 
			ease = anim.ease;
			update = null;
			end = null;
			stared = false;
		}

		var setupProperties = function() {

			localProps.length = 0;

			if(properties && !(properties instanceof Array)) {
				for(var pn in properties) {
					var p = properties[pn];
					if(p instanceof Array) {
						if(p.length == 2) localProps.push({ name:pn, from:p[0], to:p[1] });
						else localProps.push({ name:pn, from:obj[pn], to:obj[pn] + p[0] });
					} else {
						localProps.push({ name:pn, from:obj[pn], to:p });
					}
				}

				numLocalProps = localProps.length;
			}

			stared = true;
		}

		var apply = function(t) {
			for(var i = 0; i < numLocalProps; i++) {
				var p = localProps[i];
				obj[p.name] = (p.from + (p.to - p.from) * t);
			}
		}

		me.update = function(t) {
			var tt = t - st;

			if(tt < delay) {
				return;
			} else if(tt >= duration + delay) {
				if(properties) apply(1);
				if(update) update(1);
				me.cancel();
			} else {
				if(!stared) setupProperties();
				var i = ease((tt - delay) / duration);
				i = clamp01(i);
				if(properties) apply(i);
				if(update) update(i);
			}
		}

		me.onUpdate = function(cb) {
			update = cb;
			return me;
		}

		me.onEnd = function(cb) {
			end = cb;
			return me;
		}

		me.cancel = function() {

			var i = runners.indexOf(me);
			if(i == -1) return;

			runners.splice(i, 1);
			numRunners = runners.length;

			if(spareRunners.indexOf(me) == -1) {
				spareRunners.push(me);
			}

			if(end) end();

			return me;
		}

		me.start = function() {
			st = now() - timePadding;
			runners.push(me);
			numRunners = runners.length;
			return me;
		}
	}

    /**
     *  @method create
     *	@memberof SQR.Anm
     *
     *  @description Creates an animation
     *
     *  @param duration {Number} - duration of the animation in millis
     *  @param properties {Object} - the properties being animated. 
     *	The properties contains a list of properties of the animated object 
     *	along with optional start value and an end value. The example below
     *	shows three possible ways of defining the start and end values.
     *
     *	@example
var animation = SQR.Anm.create(1000, { 
	// option A: just a value, no array
	// scale from current value to 1
	scale: 1,
	// option B: 1 element array
	// rotate from current value by Math.PI 
	// i.e. end value = current value + Math.PI
	rotation: [Math.PI],
	// option C: 2 element array
	// move from 0 to 100
	position: [0, 100]
});
     *
     *	@returns {Object} An object representing the animation
     */
	anm.create = function(duration, properties) {
		
		/** 
		 *	@class Animation
		 *	@memberof SQR
		 *
		 *	@description Object that represents an animation. 
		 *	It can not be creared directly, but is returned by {@link SQR.Anm.create} (see example below).
		 *	
	 	 *	@example
var scaleIn = SQR.Anm.create(500, { x: [0, 1], y: [0, 1] });
	 	 */
		var anim = {
			properties: properties,
			duration: duration,
			ease: smoothStep
		};

		/**
		 *	@method setDuration
		 *	@memberof SQR.Anm.Animation.prototype
		 *	@description Change the duration of the animation
		 */
		anim.setDuration = function(d) {
			anim.duration = d;
			return anim;
		}

		/**
		 *	@method setEase
		 *	@memberof SQR.Anm.Animation.prototype
		 *	@description Change the easing of the animation
		 */
		anim.setEase = function(e) {
			anim.ease = e;
			return anim;
		}

		/**
		 *	@method run
		 *	@memberof SQR.Anm.Animation.prototype
		 *	@description Run the animation on an object
		 */
		anim.run = function(obj, delay) {
			var me = spareRunners.shift() || new Tween();
			me.setup(obj, delay || 0, anim);
			me.start();
			return me;
		}
	
		return anim;
	}

	/**
     *  @method update
     *	@memberof SQR.Anm
     *
     *  @description Updates the animation state. Should be called at each frame, typically inside a rAF loop.
     */
	anm.update = function() {
		var t = now();
		var i = numRunners;

		// Skip frames if FPS drop below 4
		if(lastTime && t - lastTime > 1000/4) {
			timePadding += t - lastTime;
			lastTime = t;
			return;
		}

		while(i--) {
			runners[i].update(t - timePadding);
		}

		lastTime = t;
	}

	/**
     *  @method run
     *	@memberof SQR.Anm
     *
     *  @description Starts a loop that runs the animation engine. Once started, it cannot be stopped. 
     *	This function doesn't need to be called, SQR.Anm.update() can be invoked manually each frame instead.
     *
     *	@todo Add a method to stop the loop.
     */
	anm.run = function() {
		requestAnimationFrame(anm.run);
		anm.update();
	}

	return anm;

})();