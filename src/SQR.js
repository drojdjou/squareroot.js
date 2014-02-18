"use strict";

/**
* @class
*
* Defines the namespace for all classes and a few useful variables.
* <br><br>
* Built on Tue Feb 18 08:57:55 2014
*
* @version 78
*/
var SQR = (function() {

    if(typeof window.Float32Array == "undefined") window.Float32Array = window.Array;

    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    window.requestAnimFrame = (function() {
        return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    return {
        /**
         * Shorthand for Math.PI * 2
         */
        twoPI: Math.PI * 2,

        /**
         * Shorthand for Math.PI * 0.5
         */
        halfPI: Math.PI * 0.5,

        /**
         * Shorthand for Math.PI / 180
         */
        deg2rad: Math.PI / 180,

        /**
         * Shorthand for 180 / Math.PI
         */
        rad2deg: 180 / Math.PI
    }

})();

SQR.BUILD = 78;
