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
		var obj, properties, from, to, duration, _delay, _durationWithDelay, _ease;
		var localProps = [], numLocalProps;

		me.setup = function(_obj, _properties, _from, _to, _duration, __delay, __durationWithDelay, __ease) {
			obj = _obj;
			properties = _properties;
			from = _from;
			to = _to;
			duration = _duration; 
			_delay = __delay;
			_durationWithDelay = __durationWithDelay;
			_ease = __ease;
		}

		var apply = function(v) {
			for(var i = 0; i < numLocalProps; i++) {
				var p = localProps[i];
				obj[p.name] = (p.from + (p.to - p.from) * v);
			}
		}

		me.update = function(t) {
			t = t - me.st;

			if(t >= _durationWithDelay) {
				if(properties) apply(to);
				if(me._onUpdate) me._onUpdate(to);
				me.cancel();
				if(me._onEnd) me._onEnd();
			} else {
				var inter = _ease((t - _delay) / duration);
				inter = clamp01(inter);
				if(properties) apply(inter);
				if(me._onUpdate) me._onUpdate(from + (to - from) * inter);
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

			me.st = now() - timePadding;
			runners.push(me);
			numRunners = runners.length;
		};

		me.start = function(st) {
			if(properties) apply(from);
			if(me._onUpdate) me._onUpdate(from);
			(st) ? setTimeout(_start, st) : _start();
			return me;
		}
	}

	anm.create = function(duration, properties) {
		var _delay = 0, _ease = defaultLinear, _durationWithDelay = duration;

		var anim = {};

		var from = 0, to = 1;
		if(properties instanceof Array) {
			from = properties[0], to = properties[1];
		}

		anim.ease = function(func) {
			_ease = func;
			return anim;
		}

		anim.delay = function(d) {
			_delay = d;
			_durationWithDelay = duration + d;
			return anim;
		}

		anim.applyTo = function(obj) {
			var me = spareRunners.shift() || new SQR.Tween();
			me.setup(obj, properties, from, to, duration, _delay, _durationWithDelay, _ease);
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