var Feature = (function() {

	var renderer = SQR.CanvasRenderer('canvas');

	var root = new SQR.Transform2d();
	var container = new SQR.Transform2d();
	root.add(container);

	var paths = [];

	root.rotationTarget = 0;
	root.scaleTarget = 1;
	root.positionTarget = new SQR.V2();

	container.shape = function() {
		root.rotation += (root.rotationTarget - root.rotation) * 0.1;
		root.scale.x += (root.scaleTarget - root.scale.x) * 0.1;
		root.scale.y = root.scale.x;
		root.position.lerp(root.position, root.positionTarget, 0.1);
	}

	var resize = function() {
		renderer.setSize(window.innerWidth, window.innerHeight);
		root.position.set(window.innerWidth / 2, window.innerHeight / 2);
		root.positionTarget.copyFrom(root.position);
		container.position.set(window.innerWidth / -2, window.innerHeight / -2);
	};
	
	window.addEventListener('resize', resize);
	resize();

	var run = function() {
		requestAnimationFrame(run);
		SQR.Anm.update();
		renderer.render(root);
	};

	(function() {

		var element = document.body;

		var fsf = element.requestFullScreen 
			|| element.webkitRequestFullScreen 
			|| element.mozRequestFullScreen 
			|| element.msRequestFullscreen;

		document.addEventListener('keydown', function(e) {
			if(e.keyCode == 'F'.charCodeAt(0)) {
				fsf.call(document.body);
			}

			// < 188, > 190
			// [ - 219, ] = 221
			if(e.keyCode == 188) root.rotationTarget += 0.1;
			if(e.keyCode == 190) root.rotationTarget -= 0.1;

			if(e.keyCode == 219) root.scaleTarget += 0.02;
			if(e.keyCode == 221) root.scaleTarget -= 0.02;

			//  38 up, 37, 40, 39
			if(e.keyCode == 38) root.positionTarget.y += 5;
			if(e.keyCode == 40) root.positionTarget.y -= 5;

			if(e.keyCode == 37) root.positionTarget.x += 5;
			if(e.keyCode == 39) root.positionTarget.x -= 5;
		});

	})();

	var transformCoord = function(c, isVertical) {
		if(typeof(c) == 'number') return c;
		else {

			var cn = parseInt(c.substring(0, c.length-1));
			var ss = isVertical ? window.innerHeight : window.innerWidth;

			if(c.indexOf('%') > -1) {
				return (cn / 100 * ss) | 0;
			}

			if(c.indexOf('c') > -1)	{
				return (cn + ss / 2);
			}

		}
	}

	var f = {

		DEBUG_COLOR: '#0000ff',
		DEBUG_COLOR_2: '#00ff00',
		DEBUG_COLOR_3: '#00ffff',

		registerActions: function(config, data) {
			if(config.actions) {
				document.addEventListener('keydown', function(e) {
					for(var k in config.actions) {
						var f = config.actions[k];
						var c = k.toUpperCase().charCodeAt(0);				
						if(e.keyCode == c) f(data);
					}
				});
			}
		},

		toScreen: function(x, y, v) {

			x = transformCoord(x, false);
			y = transformCoord(y, true);

			if(!v) v = new SQR.V2(); 

			v.set(x, y);

			return v;
		},

		create: function(config) {

			if(config.root) {
				var r = config.root;

				if(r.rotation) root.rotationTarget = root.rotation = r.rotation / 180 * Math.PI;

				if(r.scale) {
					root.scaleTarget = r.scale;
					root.scale.set(r.scale, r.scale);
				}

				if(r.position) {
					root.positionTarget.set(r.position[0], r.position[1]);
					root.position.copyFrom(root.positionTarget);
				}
			}

			if(config.paths) {
				for(var p in config.paths) {
					var obj = config.paths[p];
					obj.isPath = true;
					paths[p] = new window[obj.type](obj);
					container.add(new window[obj.type](obj));
				};
			}

			if(config.objects) {
				config.objects.forEach(function(obj) {
					container.add(new window[obj.type](obj, paths));
				});
			}
			return f;
		},

		start: function() {
			run();
			return f;
		}
	};

	return f;

})();