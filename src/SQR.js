"use strict";

/**
 * @class
 *
 * Defines the namespace for all classes and a few useful variables
 */
var SQR = (function() {

    if(typeof window.Float32Array == "undefined") window.Float32Array = window.Array;

    return {
        DYNAMIC_TRANSFORM: 0,
        STATIC_TRANSFORM: 1,

        /**
         * Shorthand for Math.PI * 2
         */
        twoPI: Math.PI * 2,

        /**
         * Shorthand for Math.PI / 180
         */
        deg2rad: Math.PI / 180,

        /**
         * Shorthand for 180 / Math.PI
         */
        rad2deg: 180 / Math.PI,

        supportsCss3d: false,
        usePreserve3d: false
    }

})();

// Built on Mon Oct 21 17:49:50 2013
SQR.BUILD = 58;
