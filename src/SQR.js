"use strict";

var SQR = (function() {

    if(typeof window.Float32Array == "undefined") window.Float32Array = window.Array;

    return {
        twoPI: Math.PI * 2,
        deg2rad: Math.PI / 180,
        rad2deg: 180 / Math.PI,
        supportsCss3d: true,
        usePreserve3d: true
    }

})();

// Built on Fri Nov 30 12:20:35 2012
SQR.BUILD = 23;
