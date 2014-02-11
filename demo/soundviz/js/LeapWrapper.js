var LeapWrapper = function(options) {

	options = options || {};

	var that = this;

	this.ease = 0.15;

	var down = new SQR.V3(0, 1, 0), tmp = new SQR.V3()
	var fingersDot = 0, fingersDotSmooth = 0;

	this.handOpen = 0;
	this.isActive = false;

	this.position = new SQR.V3();
	this.rotation = new SQR.V3();
	this.velocity = new SQR.V3();

	var wasActive = false;

	var read = function(frame) {
		fingersDot = 0;

	    var ffl = frame.fingers.length;
	    for(var i = 0; i < ffl; i++) {
	        var finger = frame.fingers[0];
	        var p = finger.direction;
	        tmp.set(p[0], p[1], p[2]).norm(); 
	        fingersDot += SQR.V3.dot(down, tmp);
	    }

    	fingersDot += -1 * (5 - ffl);
    	fingersDot /= 5;

    	that.frame = frame;
    	that.isActive = frame.hands.length > 0;
    	that.hand = frame.hands[0];

    	if(that.isActive != wasActive && options.toggleCallback) options.toggleCallback(that.isActive);
    	wasActive = that.isActive;
	}

	this.tick = function() {
		var e = this.ease;

		fingersDotSmooth += (fingersDot - fingersDotSmooth) * e;
		this.handOpen = 1 + fingersDotSmooth; // bc the value is [0, -1]

		if(this.hand) {
			this.position.x += (this.hand.palmPosition[0] - this.position.x) * e; 
			this.position.y += (this.hand.palmPosition[1] - this.position.y) * e; 
			this.position.z += (this.hand.palmPosition[2] - this.position.z) * e; 

			this.velocity.x += (this.hand.palmVelocity[0] - this.velocity.x) * e; 
			this.velocity.y += (this.hand.palmVelocity[1] - this.velocity.y) * e; 
			this.velocity.z += (this.hand.palmVelocity[2] - this.velocity.z) * e; 

			this.rotation.x += (this.hand.pitch() - this.rotation.x) * e; 
			this.rotation.y += (this.hand.yaw() - this.rotation.y) * e; 
			this.rotation.z += (this.hand.roll() - this.rotation.z) * e; 
		}
	}

	Leap.loop(read);

}