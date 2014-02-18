/**
 * @class
 *
 * A collection of utility methods that extend the JS Math object.
 */
 SQR.Mathx = {

    /**
     *  Clamp the value to a range.
     *  @param v the value to clamp
     *  @param s the min value to clamp to
     *  @param e the max value to clamp to
     */
    clamp: function(v, s, e) {
        if (v < s) return s;
        if (v > e) return e;
        else return v;
    },

    /**
     *  Clamp the value to a 0-1 range.
     *  @param v the value to clamp
     */
    clamp01: function(v) {
        if (v < 0) return 0;
        if (v > 1) return 1;
        else return v;
    },

    /**
     *  A step function.
     *  @param v the value 
     *  @param t the threshold
     *  @returns 0 if v < t, 1 and v >= t
     */
    step: function(v, t) {
        return (t >= v) ? 1 : 0;
    }

}