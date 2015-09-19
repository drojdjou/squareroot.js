/* --- --- [vr/Gyro.js] --- --- */

/**
 *	Author @bartekd 
 *
 *	Based on Gyro.js by Tom Gallacher <tom.gallacher23@gmail.com>
 */
SQR.Gyro = (function() {

	var quaternion = { x:0, y:0, z:0, w:1 };
	var gyro = {};
	var gotReading = false;

	gyro.getOrientation = function() {
		return quaternion;
	};

	gyro.hasGyro = function() {
		return gotReading;
	};

	var eulerToQuaternion = function(alpha, beta, gamma) {
		var x = -beta, y = -alpha; z = gamma;
		var cX = Math.cos(x / 2);
		var cY = Math.cos(y / 2);
		var cZ = Math.cos(z / 2);
		var sX = Math.sin(x / 2);
		var sY = Math.sin(y / 2);
		var sZ = Math.sin(z / 2);
		var w = cX * cY * cZ - sX * sY * sZ;
		x = sX * cY * cZ - cX * sY * sZ;
		y = cX * sY * cZ + sX * cY * sZ;
		z = cX * cY * sZ + sX * sY * cZ;
		return { x:x, y:y, z:z, w:w };
	}

	var quaternionMultiply = function(a, b) {
		return {
			w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
			x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
			y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
			z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w
		};
	}

	var wo = Math.PI * 0.5;
	var worldFix = {
		x: Math.sin(wo * 0.5),
		y: 0,
		z: 0,
		w: Math.cos(wo * 0.5),
	};

	var deviceOrientationListener = function (e) {

		e.target.removeEventListener('deviceorientation', deviceOrientationListener, true);
		e.target.addEventListener('deviceorientation', function(e) {

			var raw = eulerToQuaternion(
				e.alpha / 180 * Math.PI, 
				e.beta / 180 * Math.PI, 
				e.gamma / 180 * Math.PI
			);

			var wo = window.orientation / 180 * Math.PI;
			var orientFix = {
				x: 0,
				y: 0,
				z: Math.sin(wo * 0.5),
				w: Math.cos(wo * 0.5)
			};

			quaternion = raw;
			quaternion = quaternionMultiply(worldFix, quaternion);
			quaternion = quaternionMultiply(orientFix, quaternion);

			if(e.alpha != null) gotReading = true;

		}, true);
	}

	window.addEventListener('deviceorientation', deviceOrientationListener, true);

	return gyro;

})();

/* --- --- [vr/VRApp.js] --- --- */

SQR.VRApp = function(appFunc, options) {

	options = options || {};
	options.isTouch = ('ontouchstart' in document);
	options.vrInput = null;
	options.vrData = {};

	var vrBtn, novrBtn, startInstr;
	var fsopt = {};
	

	var INSTR_COPY_DESKTOP 	= '<span>Put on your head set and press space when ready.</span>';
	var INSTR_COPY_MOBILE 	= '<span>Put on your head set tap screen when ready.</span>';
	var BTN_COPY_VR   		= 'CARDBOARD';
	var BTN_COPY_NO_VR   	= 'NO CARDBOARD';
	var PORT_WARN_COPY   	= 'Please rotate your screen to landscape mode';

	var fullscreen = function(c) {
		if (c.requestFullscreen) {
			c.requestFullscreen(fsopt);
		} else if (c.msRequestFullscreen) {
			c.msRequestFullscreen(fsopt);
		} else if (c.mozRequestFullScreen) {
			c.mozRequestFullScreen(fsopt);
		} else if (c.webkitRequestFullscreen) {
			c.webkitRequestFullscreen(fsopt);
		}
	}

	var tryVR = function(onDone) {

		var vrHMD;		

		var onVRError = function(e) {
			console.log('Error in navigator.getVRDevices()');
			console.log(e);
			onDone();
		}

		var onVRDevices = function(devices) {

			SQR.flipMatrix = false;

			for(var i = 0; i < devices.length; i++) {
				var d = devices[i];
				if(!options.vrInput && d instanceof PositionSensorVRDevice) options.vrInput = d;
				if(!vrHMD && d instanceof HMDVRDevice) vrHMD = d;
				fsopt.vrDisplay = vrHMD;
			}

			// console.log(options.vrInput);
			// console.log(vrHMD.getEyeParameters("left"));

			options.vrData.leftEyeX  =  vrHMD.getEyeParameters("left").eyeTranslation.x;
			options.vrData.rightEyeX = vrHMD.getEyeParameters("right").eyeTranslation.x;
			onDone();
		}

		if(!navigator.mozGetVRDevices && !navigator.getVRDevices) {
			console.log("Your browser is not VR Ready");
			onDone();
			return;
		}

		if(navigator.getVRDevices) {
			navigator.getVRDevices().then(onVRDevices, onVRError);
		} else {
			navigator.mozGetVRDevices(onVRDevices);
		}
	}

	var onKeyDown = function(e) {
		if(e.keyCode == 32) {
			document.removeEventListener('keydown', onKeyDown);
			startApp();
		}
	}

	var startApp = function(e) {
		if(vrBtn) document.body.removeChild(vrBtn);
		if(novrBtn) document.body.removeChild(novrBtn);
		if(startInstr) document.body.removeChild(startInstr);
		if(options.isTouch || (options.vrInput && !options.debug)) fullscreen(document.body);
		if(appFunc) appFunc(options);
	}

	var prepare = function() {

		if(options.vrInput && !options.isTouch) {

			startInstr = document.createElement('div');
			startInstr.innerHTML = INSTR_COPY_DESKTOP + INSTR_COPY_DESKTOP;
			startInstr.setAttribute('class', 'instr');
			document.body.appendChild(startInstr);
			
			document.addEventListener('keydown', onKeyDown);

		} else if(options.isTouch) {

			vrBtn = document.createElement('div');
			vrBtn.setAttribute('class', 'start vr');
			vrBtn.innerHTML = BTN_COPY_VR;
			document.body.appendChild(vrBtn);

			novrBtn = document.createElement('div');
			novrBtn.setAttribute('class', 'start novr');
			novrBtn.innerHTML = BTN_COPY_NO_VR;
			document.body.appendChild(novrBtn);

			portWarn = document.createElement('div');
			portWarn.setAttribute('class', 'portrait-warning');
			portWarn.innerHTML = PORT_WARN_COPY;
			document.body.appendChild(portWarn);

			vrBtn.addEventListener('click', function() {
				options.forceStereo = true;
				startApp();
			});

			novrBtn.addEventListener('click', startApp);

		} else {
			startApp();
		}	
	}

	tryVR(prepare);
};



/* --- --- [vr/VRPost.js] --- --- */

SQR.VRPost = function(camera, renderer, ctx, options) {

	var width, height, halfWidth;

	var fbo, post;

	var isStereo = options.vrInput || options.debug || options.forceStereo;

	renderer.autoClear = false;

	var left = new SQR.Transform();
	var right = new SQR.Transform();

	left.position.x =  options.vrData.leftEyeX  || -0.1;
	right.position.x = options.vrData.rightEyeX || 0.1;

	if(options.isTouch || options.vrInput) camera.useQuaternion = true;
	camera.add(left, right);

	if(options.customShader) {
		fbo = SQR.FrameBuffer(0, 0);    
	    post = SQR.Primitives.createPostEffect(options.customShader);
		
	    post.uniforms = {
	    	scale: 			new SQR.V2(0.81, 0.81),
			scaleIn: 		new SQR.V2(1.0, 1.0),
			lensCenter: 	new SQR.V2(0.0, 0.0),
			hmdWarpParam: 	[1.0, 0.11, 0.12, 0.0],
			chromAbParam: 	[0.996, -0.004, 1.014, 0.0]
	    };
	}
	
	var p = {

		size: function() {
			var pr = window.devicePixelRatio;

			width = window.innerWidth * pr; 
			height = window.innerHeight * pr;
			halfWidth = width / 2;

			ctx.size(window.innerWidth, window.innerHeight, pr);

			if(options.customShader) fbo.resize(halfWidth, height);

			var aspect = width / height;
			var halfAspect = (width * 0.5) / height;

			var p = new SQR.ProjectionMatrix().perspective(isStereo ? 75 : 50, isStereo ? halfAspect : aspect, 0.01, 10000);
			camera.projection = p;
			left.projection = p;
			right.projection = p;
		},

		render: function(root) {

			if(options.vrInput) {
				var state = options.vrInput.getState();

				if(state.orientation !== null) {
					camera.quaternion.copyFrom(state.orientation);
				}

				if(state.position !== null) {
					camera.position.copyFrom(state.position);
				}

			} else if(options.isTouch && SQR.Gyro.hasGyro()) {

				camera.quaternion.copyFrom(SQR.Gyro.getOrientation());

			} else if(options.customCameraAnimation) {

				options.customCameraAnimation();

			}

			ctx.viewport(0, 0, width, height);
			ctx.clear();

			if(isStereo) {

				ctx.viewport(0, 0, halfWidth, height);
				renderer.render(root, left);

				ctx.viewport(halfWidth, 0, halfWidth, height);
				renderer.render(root, right);

			// } else if(options.isTouch) {

				//

				// 	fbo.bind();
				// 	ctx.clear();
				// 	renderer.render(root, left);
				// 	renderer.renderToScreen();
				// 	ctx.viewport(0, 0, halfWidth, height);
				// 	post.shader.use().setUniform('uTexture', fbo.texture);
				// 	renderer.render(post);

				// 	fbo.bind();
				// 	ctx.clear();
				// 	renderer.render(root, right);
				// 	renderer.renderToScreen();
				// 	ctx.viewport(halfWidth, 0, halfWidth, height);
				// 	post.shader.use().setUniform('uTexture', fbo.texture);
				// 	renderer.render(post);

			} else {

				renderer.render(root, camera);
			}
		}
	};

	return p;

}

