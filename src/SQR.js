"use strict";

var SQR = (function() {

    if(typeof window.Float32Array == "undefined") window.Float32Array = window.Array;

    return {
        DYNAMIC_TRANSFORM: 0,
        STATIC_TRANSFORM: 1,

        twoPI: Math.PI * 2,
        deg2rad: Math.PI / 180,
        rad2deg: 180 / Math.PI,

        supportsCss3d: false,
        usePreserve3d: false
    }

})();

// Built on Wed Jan 16 09:04:30 2013
SQR.BUILD = 33;
