/**
 * @class
 *
 * A collection of interpolation functions.
 */
SQR.Interpolation = {

    /**
     *  Returns the position on a curve for a position (per axis)
     *  @param t interpolation value [0-1]
     *  @param p0 start position
     *  @param c0 first control point
     *  @param c1 second control point
     *  @param p1 end position
     */
    bezierPosition: function(t, p0, c0, c1, p1) {
        return p0 * (1 - t) * (1 - t) * (1 - t) +
            c0 * 3 * t * (1 - t) * (1 - t) +
            c1 * 3 * t * t * (1 - t) +
            p1 * t * t * t;
    },

    /**
     *  Returns the velocity on the curve for a position (per axis)
     *  @param t interpolation value [0-1]
     *  @param p0 start position
     *  @param c0 first control point
     *  @param c1 second control point
     *  @param p1 end position
     */
    bezierVelocity: function(t, p0, c0, c1, p1) {
        return (3 * c0 - 3 * p0)
            + 2 * (3 * p0 - 6 * c0 + 3 * c1) * t
            + 3 * (-p0 + 3 * c0 - 3 * c1 + p1) * t * t;
    },

    /**
     *  Linear interpolation a between two values
     *  @param e0 start value
     *  @param e1 end value
     *  @param t interpolation value [0-1]
     */
    linear: function(e0, e1, t) {
        if(t <= e0) return e0;
        if(t >= e1) return e1;

        t = (t - e0) / (e1 - e0);

        return e0 + (e1 - e0) * t;
    },
    
    /**
     *  Smoothstep interpolation a between two values
     *  @param e0 start value
     *  @param e1 end value
     *  @param t interpolation value [0-1]
     */
    smoothStep: function(e0, e1, t) {
        if(t <= e0) return e0;
        if(t >= e1) return e1;

        t = (t - e0) / (e1 - e0);

        return e0 + (e1 - e0) * (3 * t * t - 2 * t * t * t);
    },

    /**
     *  Quadratic ease in based on Penner equations
     *  @param t interpolation value [0-1]
     */
    quadIn: function (t) {
        return t * t;
    },

    /**
     *  Quadratic ease out based on Penner equations
     *  @param t interpolation value [0-1]
     */
    quadOut: function (t) {
        return t * (2 - t);
    },

    /**
     *  Quadratic ease in-out based on Penner equations
     *  @param t interpolation value [0-1]
     */
    quadInOut: function (t) {
        if (( t *= 2 ) < 1)
            return 0.5 * t * t;
        else
            return -0.5 * ( --t * ( t - 2 ) - 1 );
    }

};