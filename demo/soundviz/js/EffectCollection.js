var EffectCollection = function() {

	var effects = {}, current;

	this.add = function(name, object) {
		effects[name] = object;
		return this;
	}

	this.onBeat = function() {
		current.onBeat();
	}

	this.render = function(target, root, camera, leap) {
		current.render(target, root, camera, leap);
	}

	this.use = function(name) {
		current = effects[name];
		current.use();
	}
}