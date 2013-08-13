Animation = function(obj, prop, vOut, tIn, tOut, ease, init) {

    var clean = false;
    var vIn;

    ease = ease || SQR.Interpolation.smoothStep;

    this.update = function(t) {

        // Don't touch the object if this isn't your time
        if (t <= tIn || t >= tOut) {
            if (!clean && t >= tOut) obj[prop] = vOut;
            clean = true;
        } else {
            if(clean) {
                vIn = init || obj[prop];
                obj[prop] = vIn;
            }

            var tt = (t - tIn) / (tOut - tIn);
            obj[prop] = vIn + (vOut - vIn) * ease(0, 1, tt);
            clean = false;
        }
    }
}