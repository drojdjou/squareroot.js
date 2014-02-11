var NoEffect = function(engine) {

    this.use = function() {
        engine.setClearColor(0, 0, 0, 1);
    }

	this.onBeat = function() {
	}

	this.render = function(target, root, camera) {
        engine.render(root, camera);
	}

}