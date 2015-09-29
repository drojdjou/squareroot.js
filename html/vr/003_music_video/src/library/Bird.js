MV.Bird = function($) {

	$.lib.scheduleLoad('glsl/bird.glsl', 'birdshader');
	$.lib.scheduleLoad('json/bird.json', 'birdmesh');
	$.lib.scheduleLoad('json/birdScene.json', 'birdscene');
	$.lib.scheduleLoad('json/birdAnim.json', 'birdanim');

	var b, create = function() {

		var s = SQR.SceneParser.parse($.assets, { 
			shader: $.assets['birdshader'], 
			prefix: 'bird',
			flipMatrix: false
		});

		b = s.root.findByName('seagull');
		return b;
	}

	

	$.lib.register('bird', function() {
		return b ? b : create();
	});

};