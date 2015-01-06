SQR.Anm = (function() {

	var anm = {};
	var runnersCreated = 0;
	var runners = [], numRunners = 0, spareRunners = [];
	var timePadding = 0, lastTime;

	var now = function() {
		return new Date().getTime();
	};

	var defaultLinear = function(t) {
		return t;
	};

	var clamp01 = function(t) {
		if(t >= 1) return 1;
		if(t <= 0) return 0;
		else return t;
	}

	SQR.Tween = function() {

		var me = this;
		var obj, properties, duration, _delay, _durationWithDelay, _ease;
		var localProps = [], numLocalProps, t = 0;

		me.setup = function(_obj, _properties, _duration, __delay, __ease) {
			obj = _obj;
			properties = _properties;
			duration = _duration; 
			_delay = __delay;
			_durationWithDelay = _duration + _delay;
			_ease = __ease;
			me._onUpdate = null;
			me._onEnd = null;
			setProperties();
		}

		var apply = function(v) {
			for(var i = 0; i < numLocalProps; i++) {
				var p = localProps[i];
				obj[p.name] = (p.from + (p.to - p.from) * v);
			}
		}

		var setProperties = function() {
			localProps.length = 0;

			if(properties && !(properties instanceof Array)) {
				for(var pn in properties) {
					var p = properties[pn];
					if(p instanceof Array) {
						localProps.push({ name:pn, from:p[0], to:p[1] });
					} else {
						localProps.push({ name:pn, from:obj[pn], to:p });
					}
				}

				numLocalProps = localProps.length;
			}
		}

		me.update = function(t) {
			var tt = t - me.st;

			if(tt >= _durationWithDelay) {
				if(properties) apply(1);
				if(me._onUpdate) me._onUpdate(1);
				me.cancel();
				if(me._onEnd) me._onEnd();
			} else {
				var inter = _ease((tt - _delay) / duration);
				inter = clamp01(inter);
				if(properties) apply(inter);
				if(me._onUpdate) me._onUpdate(inter);
			}
		}

		me.onUpdate = function(cb) {
			me._onUpdate = cb;
			return me;
		}

		me.onEnd = function(cb) {
			me._onEnd = cb;
			return me;
		}

		me.cancel = function() {

			runners.splice(runners.indexOf(me), 1);
			numRunners = runners.length;

			if(spareRunners.indexOf(me) == -1) {
				spareRunners.push(me);
			}

			return me;
		}

		var _start = function() {
			t = 0;
			me.st = now() - timePadding;
			runners.push(me);
			numRunners = runners.length;
		};

		me.start = function(st) {
			setProperties();
			if(properties) apply(0);
			if(me._onUpdate) me._onUpdate(0);
			(st) ? setTimeout(_start, st) : _start();
			return me;
		}
	}

	anm.create = function(duration, properties) {
		var _delay = 0, _ease = defaultLinear;

		var anim = {
			properties: properties,
			duration: duration
		};

		var from = 0, to = 1;

		anim.ease = function(func) {
			_ease = func;
			return anim;
		}

		anim.delay = function(d) {
			_delay = d;
			return anim;
		}

		anim.applyTo = function(obj) {
			var me = spareRunners.shift() || new SQR.Tween();
			me.setup(obj, properties, anim.duration, _delay, _ease);
			return me;
		}
	
		return anim;
	}

	anm.update = function() {
		var t = now();
		var i = numRunners;

		if(lastTime && t - lastTime > 100) {
			timePadding += t - lastTime;
			lastTime = t;
			return;
		}

		while(i--) {
			runners[i].update(t - timePadding);
		}

		lastTime = t;
	}

	anm.run = function() {
		requestAnimationFrame(anm.run);
		anm.update();
	}

	return anm;
})();