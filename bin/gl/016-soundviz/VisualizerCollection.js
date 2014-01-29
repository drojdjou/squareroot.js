var VisualizerCollection = function(root) {

	var visualizers = {}, current;

	this.add = function(name, object) {
		visualizers[name] = object;
		return this;
	}

	this.update = function(sound) {
		current.update(sound);
	}

	this.onBeat = function() {
		current.onBeat();
	}

	this.use = function(name) {
		if(current) root.remove(current.object);
		root.add(visualizers[name].object);
		current = visualizers[name];
	}
}