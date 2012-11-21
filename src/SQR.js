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

// Built on Tue Nov 20 17:18:10 2012
SQR.BUILD = 15;
