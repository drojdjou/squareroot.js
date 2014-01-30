var VisualizerCollection = function(root) {

	var visualizers = {}, current;

	this.add = function(name, object) {
		visualizers[name] = object;
		return this;
	}

	this.update = function(sound, camera) {
		current.update(sound, camera);
	}

	this.onBeat = function(camera) {
		current.onBeat(camera);
	}

	this.use = function(name) {
		if(current) {
			root.remove(current.object);
			current.dispose();
		}
		root.add(visualizers[name].object);
		current = visualizers[name];
		current.use();
	}
}