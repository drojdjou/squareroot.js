MV.S01 = function($) {

	var skybox, bird, dust;
	var birdPath;

	var smoothStep = function(s, e, t) {
		if(t <= s) return 0;
		if(t >= e) return 1;
		else return SQR.Interpolation.smoothStep((t - s) / (e - s));
	}

	var manage = function(isIn) {

		if(isIn) {

			skybox = $.lib.get('skybox');
			skybox.uniforms.uDark = 0;

			bird = $.lib.get('bird');
			bird.useQuaternion = false;
			bird.position.z = -30;
			bird.animation.setTimeScale(1);
			bird.animation.play();
			$.root.add(skybox, bird);

		} else {

			$.root.remove(bird);

		}
	}

	var update = function(t) {
		skybox.uniforms.uDark = smoothStep(0, 0.33, t);

		bird.position.z = -30 + 30 * t;
		var e = smoothStep(0.8, 1.0, t * t);
		bird.position.x = -0.5 * e;
		bird.position.y = 1 * e;

		bird.rotation.x = -0.7 * e;
		bird.rotation.z =  0.5 * e;
	}

	$.tmn.registerScene(
		1000, 
		9000, 
		update, 
		manage
	); 

	// $.tmn.timer.onAt(0, function() {

	// 	skybox = $.lib.get('skybox');
	// 	$.root.add(skybox);

	// 	skybox.uniforms.uDark = 0;

	// 	TweenLite.to(skybox.uniforms, 5, { uDark: 1, ease: Power2.easeOut })
	// });

	// $.tmn.timer.onAt(0, function() {

	// 	bird = $.lib.get('bird');
	// 	bird.useQuaternion = false;

	// 	// bird.position.z = -5;
	// 	bird.position.z = -30;

	// 	bird.uniforms = {
	// 		uColor: new SQR.Color().setRGB(1, 1, 1)
	// 	};
		
	// 	bird.animation.setTimeScale(1);
	// 	bird.animation.play();
	// 	$.root.add(bird);


	// 	TweenLite.to(bird.position, 6, { z: 0 });

	// });

	// $.tmn.timer.onAt(4000, function() {
	// 	bird.animation.setTimeScale(0.8);
	// 	TweenLite.to(bird.position, 2, { y: 2, x: -2, ease: Power2.easeIn });
	// 	TweenLite.to(bird.rotation, 2, { z: 0.9, x: 1.2, ease: Power2.easeIn });
	// });

}