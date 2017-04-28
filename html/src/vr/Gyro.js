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

	gyro.getOrientation = function() {

		if(!initialized) {
			init();
		}

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
			if(e.alpha != null) gotReading = true;
			else return;

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

		}, true);
	}

	var init = function() {
		window.addEventListener('deviceorientation', deviceOrientationListener, true);
		initialized = true;
	}

	return gyro;

})();