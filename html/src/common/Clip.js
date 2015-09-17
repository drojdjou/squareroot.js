SQR.Clip = function(duration) {

	var c = {
		timeScale: 1,
		duration: duration,
		reverse: false,
		playing: false
	};

	var t = 0;
	var properties = [];
	var numProps = 0;
	var tmp = new SQR.V3();

	var setValue = function(target, key, value) {
		switch(key) {
			case 'px': target.position.x = value; break;
			case 'py': target.position.y = value; break;
			case 'pz': target.position.z = value; break;
			case 'rx': target.quaternion.x = value; break;
			case 'ry': target.quaternion.y = value; break;
			case 'rz': target.quaternion.z = value; break;
			case 'rw': target.quaternion.w = value; break;
			default:
				console.warn('Unknown animation property: ', key, ' on ', target);
		}
	}

	// keyframes = Array of V2||V3 or and array of bezier curves
	c.addProperty = function(property, keyframes) {

		var p = {
			prop: property,
			keys: keyframes
		};

		p.size = p.keys.length;

		properties.push(p);
		numProps = properties.length;

		return c;
	}

	c.gotoTime = function(ms) {
		t = Math.max(ms, 0); 
		t = Math.min(ms, c.duration);
	}

	c.update = function(target, time, delta) {

		if(!c.playing || numProps == 0) return;

		var p = delta / 1000 * c.timeScale;
		t += c.reverse ? -p : p;
		if(t < 0) t += duration;
		t = t % duration;

		for(var i = 0; i < numProps; i++) {
			var p = properties[i];

			for(var j = 0; j < p.size; j++) {
				var k1 = p.keys[j+0];
				var k2 = p.keys[j+1];

				if(k1 instanceof SQR.V2) {
					if(t >= k1.x && t < k2.x) {
						var lt = (t - k1.x) / (k2.x - k1.x);
						var v = k1.y + (k2.y - k1.y) * lt;
						setValue(target, p.prop, v);
						break;
					}
				} else if(k1 instanceof SQR.Bezier) {
					var ts = t;
					if(ts >= k1.p0.x && ts < k1.p1.x) {
						var lt = ((ts) - k1.p0.x) / (k1.p1.x - k1.p0.x);
						k1.valueAt(lt, tmp);
						setValue(target, p.prop, tmp.y);
						break;
					}
				}
			}
		}
	}

	

	return c;

}