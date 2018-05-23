/**
 *	@class Gyro
 *	@memberof SQR
 *
 *	@description A gyrospcope data handler, based on Gyro.js by Tom Gallacher <tom.gallacher23@gmail.com>
 */
SQR.Gyro = (function() {

	var quaternion = { x:0, y:0, z:0, w:1 };
	var gyro = {};
	var gotReading = false;
	var initialized = false;

	var lastTime, deltaTime = 0, numReadings = 0, sumDelta = 0, maxFreq = 60; 
	// if event fires less often than this, consider it beign to slow (60ms = 16.66Hz / fps)

	gyro.getOrientation = function(dontinit) {

		if(!initialized && !dontinit) {
			init();
		}

		return quaternion;
	};

	gyro.hasGyro = function() {
		return gotReading;
	};

	gyro.isSlow = function() {
		return initialized && (numReadings < 3 || gyro.delta() > maxFreq);
	}

	gyro.delta = function() {
		return numReadings == 0 ? 0 : parseInt(sumDelta / numReadings);
	}

	gyro.externalProcess = function(alpha, beta, gamma, orientation) {
		processGyroData(alpha, beta, gamma, orientation);
	}

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

	var deviceOrientationListener = function(e) {

		if(lastTime) {
			deltaTime = new Date().getTime() - lastTime;
			numReadings++;
			sumDelta += deltaTime;
		}

		lastTime = new Date().getTime();

		processGyroData(e.alpha, e.beta, e.gamma, window.orientation);
	}

	var processGyroData = function(alpha, beta, gamma, orientation) {

		if(alpha != null && window.orientation != null) {
			gotReading = true;
		} else {
			return;
		}

		var raw = eulerToQuaternion(
			alpha / 180 * Math.PI, 
			beta / 180 * Math.PI, 
			gamma / 180 * Math.PI
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

	};

	var init = function() {
		window.addEventListener('deviceorientation', deviceOrientationListener, true);
		initialized = true;
	}

	return gyro;

})();