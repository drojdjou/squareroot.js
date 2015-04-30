SQR.VRApp = function(appFunc, options) {

	options = options || {};
	options.isTouch = ('ontouchstart' in document);
	options.vrInput = null;
	options.vrData = {};

	SQR.flipMatrix = options.flipMatrix || false;

	var startBtn, startInstr;

	var INSTR_COPY = '<span>Put on your head set and press space when ready.</span>';
	var BTN_COPY   = 'Start';

	var fullscreen = function(c) {
		if (c.requestFullscreen) {
			c.requestFullscreen();
		} else if (c.msRequestFullscreen) {
			c.msRequestFullscreen();
		} else if (c.mozRequestFullScreen) {
			c.mozRequestFullScreen();
		} else if (c.webkitRequestFullscreen) {
			c.webkitRequestFullscreen();
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
			for(var i = 0; i < devices.length; i++) {
				var d = devices[i];

				if(!options.vrInput && d instanceof PositionSensorVRDevice) options.vrInput = d;

				if(!vrHMD && d instanceof HMDVRDevice) vrHMD = d;
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
		if(startBtn) document.body.removeChild(startBtn);
		if(startInstr) document.body.removeChild(startInstr);
		if((options.isTouch || options.vrInput) && !options.debug) fullscreen(document.body);
		if(appFunc) appFunc(options);
	}

	var prepare = function() {
		if(options.debug) {
			startApp();
		} else if(options.vrInput) {
			startInstr = document.createElement('div');
			startInstr.innerHTML = INSTR_COPY + INSTR_COPY;
			startInstr.setAttribute('class', 'instr');
			document.body.appendChild(startInstr);
			document.addEventListener('keydown', onKeyDown);
		} else if(options.isTouch) {
			startBtn = document.createElement('div');
			startBtn.setAttribute('class', 'start');
			startBtn.innerHTML = BTN_COPY;
			document.body.appendChild(startBtn);
			startBtn.addEventListener('click', startApp);
			document.addEventListener('keydown', onKeyDown);
		} else {
			startApp();
		}
		
	}

	tryVR(prepare);
};

