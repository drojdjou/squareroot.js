var VisualizerCollection = function(root) {

	var visualizers = {}, current;

	this.add = function(name, object) {
		visualizers[name] = object;
		return this;
	}

	this.update = function(sound, camera, leap) {
		current.update(sound, camera, leap);
	}

	this.onBeat = function(camera) {
		current.onBeat(camera);
	}

	this.use = function(name, camera, leap) {
		if(current) {
			root.remove(current.object);
			current.dispose(camera, leap);
		}
		root.add(visualizers[name].object);
		current = visualizers[name];
		current.use(camera, leap);
	}
}