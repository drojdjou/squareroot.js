SQR.Time = {}

SQR.Time.time = 0;
SQR.Time.startTime = 0;
SQR.Time.timeOffset = 0;
SQR.Time.lastTime = 0;
SQR.Time.deltaTime = 0;

SQR.Time.tick = function() {
	var tn = new Date().getTime();

	if (SQR.Time.startTime == 0) SQR.Time.startTime = tn;
    if (SQR.Time.lastTime != 0) SQR.Time.deltaTime = tn - SQR.Time.lastTime;

    SQR.Time.lastTime = tn;
	SQR.Time.time = (tn - (SQR.Time.startTime)) / 1000.0;

    SQR.Time.deltaTime /= 1000.0;
};

SQR.Time.getTime = function() {
    SQR.Time.tick();
    return SQR.Time.deltaTime;
}

SQR.Time.pause = function() {
    SQR.Time.timeOffset = new Date().getTime();
}

SQR.Time.resume = function() {
    SQR.Time.startTime += new Date().getTime() - SQR.Time.timeOffset;
    SQR.Time.lastTime = SQR.Time.deltaTime = 0;
}

SQR.Time.formatTime = function(t, useMillis) {

    if(!t) t = SQR.Time.time;

	var mil = Math.floor((t % 1) * 100);
	var sec = Math.floor(t) % 60;
	var min = Math.floor(t / 60);

	if(mil < 10) mil = "0" + mil;
	if(mil == 100) mil = "00";

	if(sec < 10) sec = "0" + sec;
	if(min < 10) min = "0" + min;

	if(useMillis) return min + ":" + sec + ":" + mil;
    else return min + ":" + sec;
}
