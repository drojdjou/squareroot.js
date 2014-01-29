var EffectCollection = function() {

	var effects = {}, current;

	this.add = function(name, object) {
		effects[name] = object;
		return this;
	}

	this.onBeat = function() {
		current.onBeat();
	}

	this.render = function(target, root, camera) {
		current.render(target, root, camera);
	}

	this.use = function(name) {
		current = effects[name];
		current.use();
	}
}