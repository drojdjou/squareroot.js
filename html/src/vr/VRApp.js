SQR.VRApp = function(appFunc, options) {

	options = options || {};
	options.isTouch = ('ontouchstart' in document);
	options.vrInput = null;
	options.vrData = {};

	var startBtn, startInstr;
	var fsopt = {};
	

	var INSTR_COPY 			= '<span>Put on your head set and press space when ready.</span>';
	var BTN_COPY   			= 'Start';
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
		if(startBtn) document.body.removeChild(startBtn);
		if(startInstr) document.body.removeChild(startInstr);
		if(options.isTouch || (options.vrInput && !options.debug)) fullscreen(document.body);
		if(appFunc) appFunc(options);
	}

	var prepare = function() {
		if(options.debug && !options.isTouch) {
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

			portWarn = document.createElement('div');
			portWarn.setAttribute('class', 'portrait-warning');
			portWarn.innerHTML = PORT_WARN_COPY;

			document.body.appendChild(startBtn);
			document.body.appendChild(portWarn);

			startBtn.addEventListener('click', startApp);
			document.addEventListener('keydown', onKeyDown);
		} else {
			startApp();
		}
		
	}

	tryVR(prepare);
};

