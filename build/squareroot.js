/*

Squareroot.js
A micro 3d engine for Canvas and CSS

Version 1
Build 0 | Tue Nov 20 14:38:37 2012

Uses requestAnimationFrame
http://paulirish.com/2011/requestanimationframe-for-smart-animating/

*/
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

})();SQR.Color = function(h, s, l, a) {
    this.applyLight = function(dot) {
        return SQR.Color.hsl(h, s, l - 60 + 80 * dot, a);
    }

    this.toHSLString = function() {
        return SQR.Color.hsl(h, s, l, a);
    }
}

SQR.Color.hsl = function(hue, sat, lht, alp) {
    if (alp)
        return 'hsla(' + hue + ',' + sat + '%,' + lht + '%, ' + alp + ')';
    else
        return 'hsl(' + hue + ',' + sat + '%,' + lht + '%)';
}/**
 * A matrix that implements 2D affine transformations.
 */
SQR.Matrix2D = function() {

    if (typeof Float32Array == 'undefined') Float32Array = Array;
    this.data = new Float32Array(9);

    var a, b, d, x, y;

    this.identity = function() {
        d = this.data;
        d[0] = 1,d[1] = 0,d[2] = 0;
        d[3] = 0,d[4] = 1,d[5] = 0;
        d[6] = 0,d[7] = 0,d[8] = 1;
        return this;
    }

    this.transformVector = function(v) {
        d = this.data;
        x = v.x,y = v.y;
        v.x = d[0] * x + d[1] * y + d[2];
        v.y = d[3] * x + d[4] * y + d[5];
        return v;
    }

    this.setTranslation = function(tx, ty, m) {
        d = m || this.data;
        d[0] = 1,d[1] = 0,d[2] = tx;
        d[3] = 0,d[4] = 1,d[5] = ty;
        d[6] = 0,d[7] = 0,d[8] = 1;
        return this;
    }

    this.getTranslation = function(v) {
        d = this.data;
        v = v || new SQR.V2();
        v.x = d[2];
        v.y = d[5];
        return v;
    }

    this.setScale = function(sx, sy, m) {
        d = m || this.data;
        d[0] = sx,d[1] = 0,d[2] = 0;
        d[3] = 0,d[4] = sy,d[5] = 0;
        d[6] = 0,d[7] = 0,d[8] = 1;
        return this;
    }

    this.setShear = function(sx, sy, m) {
        d = m || this.data;
        d[0] = 1,d[1] = sx,d[2] = 0;
        d[3] = sy,d[4] = 1,d[5] = 0;
        d[6] = 0,d[7] = 0,d[8] = 1;
        return this;
    }

    this.setRotation = function(a, m) {
        d = m || this.data;
        var r0 = Math.cos(a);
        var r1 = Math.sin(a);
        d[0] = r0,d[1] = -r1,d[2] = 0;
        d[3] = r1,d[4] = r0,d[5] = 0;
        d[6] = 0,d[7] = 0,d[8] = 1;
        return this;
    }

    this.setTRS = function(tx, ty, a, sx, sy) {
        d = this.data;
        var r0 = Math.cos(a);
        var r1 = Math.sin(a);
        d[0] = r0 * sx,d[1] = -r1 * sy,d[2] = tx;
        d[3] = r1 * sx,d[4] = r0 * sy,d[5] = ty;
        d[6] = 0,d[7] = 0,d[8] = 1;
        return this;
    }

    this.translate = function(tx, ty) {
        this.setTranslation(tx, ty, SQR.Matrix2D.__temp);
        return this.multiply(SQR.Matrix2D.__temp);
    }

    this.rotate = function(a) {
        this.setRotation(a, SQR.Matrix2D.__temp);
        return this.multiply(SQR.Matrix2D.__temp);
    }

    this.scale = function(sx, sy) {
        this.setScale(sx, sy, SQR.Matrix2D.__temp);
        return this.multiply(SQR.Matrix2D.__temp);
    }

    this.shear = function(sx, sy) {
        this.setRotation(sx, sy, SQR.Matrix2D.__temp);
        return this.multiply(SQR.Matrix2D.__temp);
    }

    var a11, a12, a13, a21, a22, a23, a31, a32, a33;
    var b11, b12, b13, b21, b22, b23, b31, b32, b33;

    this.multiply = function(m) {
        a = this.data,b = m.data || m;

        a11 = a[0],a12 = a[1],a13 = a[2];
        a21 = a[3],a22 = a[4],a23 = a[5];
        a31 = a[6],a32 = a[7],a33 = a[8];

        b11 = b[0],b12 = b[1],b13 = b[2];
        b21 = b[3],b22 = b[4],b23 = b[5];
        b31 = b[6],b32 = b[7],b33 = b[8];

        a[0] = a11 * b11 + a12 * b21 + a13 * b31;
        a[1] = a11 * b12 + a12 * b22 + a13 * b32;
        a[2] = a11 * b13 + a12 * b23 + a13 * b33;

        a[3] = a21 * b11 + a22 * b21 + a23 * b31;
        a[4] = a21 * b12 + a22 * b22 + a23 * b32;
        a[5] = a21 * b13 + a22 * b23 + a23 * b33;

        //a[6] = a31 * b11 + a32 * b21 + a33 * b31;
        //a[7] = a31 * b12 + a32 * b22 + a33 * b32;
        //a[8] = a31 * b13 + a32 * b23 + a33 * b33;

        return this;
    }

    this.copyTo = function(m) {
        a = this.data,b = m.data || m;

        b[0] = a[0],b[1] = a[1],b[2] = a[2];
        b[3] = a[3],b[4] = a[4],b[5] = a[5];
        b[6] = a[6],b[7] = a[7],b[8] = a[8];

        return m;
    }

    this.copyFrom = function(m) {
        a = m.data || m,b = this.data;

        b[0] = a[0],b[1] = a[1],b[2] = a[2];
        b[3] = a[3],b[4] = a[4],b[5] = a[5];
        b[6] = a[6],b[7] = a[7],b[8] = a[8];

        return this;
    }

    var noe = function (n) {
        return Math.abs(n) < 0.000001 ? 0 : n;
    };

    this.getAsCSSProperty = function(use3d) {
        var d = this.data;

        if(use3d) {
            return 'matrix3d(' +
                noe(d[0]) + ',' +
                noe(d[3]) + ',' +
                '0,' +
                '0,' +

                noe(d[1]) + ',' +
                noe(d[4]) + ',' +
                '0,' +
                '0,' +

                '0,' +
                '0,' +
                '1,' +
                '0,' +

                noe(d[2]) + ',' +
                noe(d[5]) + ',' +
                '0,' +
                '1' +
                ')';
        } else {
            return 'matrix(' +

                noe(d[0]) + ',' +
                noe(d[3]) + ',' +

                noe(d[1]) + ',' +
                noe(d[4]) + ',' +

                noe(d[2]) + ',' +
                noe(d[5]) +

                ')';
        }
    }

    this.identity();
}















SQR.Matrix33 = function() {

    this.data = new Float32Array(9);

    this.identity = function() {
        var d = this.data;
        d[0] = 1,d[3] = 0,d[6] = 0;
        d[1] = 0,d[4] = 1,d[7] = 0;
        d[2] = 0,d[5] = 0,d[8] = 1;
        return this;
    }

    this.transformVector = function (v, pv) {
        var d = this.data;
        var x = v.x, y = v.y, z = v.z, w = v.w;
        pv = pv || v;

        pv.x = d[0] * x + d[3] * y + d[6] * z;
        pv.y = d[1] * x + d[4] * y + d[7] * z;
        pv.z = d[2] * x + d[5] * y + d[8] * z;

        return pv;
    }

    this.determinant = function() {
        var d = this.data;

        return d[0] * (d[4] * d[8] - d[7] * d[5]) +
               d[3] * (d[7] * d[2] - d[1] * d[8]) +
               d[6] * (d[1] * d[5] - d[4] * d[2]);
    }

    this.inverse = function(m) {
        var d = this.data;
        m = m || this.data;

        var a00 = d[0], a01 = d[1], a02 = d[2],
            a10 = d[3], a11 = d[4], a12 = d[5],
            a20 = d[6], a21 = d[7], a22 = d[8],

            b01 = a22 * a11 - a12 * a21,
            b11 = -a22 * a10 + a12 * a20,
            b21 = a21 * a10 - a11 * a20,

            d = a00 * b01 + a01 * b11 + a02 * b21,
            id;

        if (!d) {
            console.warn("Attempt to inverse a singular matrix44. ", this.data);
            return m;
        }
        
        id = 1 / d;

        m[0] = b01 * id;
        m[1] = (-a22 * a01 + a02 * a21) * id;
        m[2] = (a12 * a01 - a02 * a11) * id;
        m[3] = b11 * id;
        m[4] = (a22 * a00 - a02 * a20) * id;
        m[5] = (-a12 * a00 + a02 * a10) * id;
        m[6] = b21 * id;
        m[7] = (-a21 * a00 + a01 * a20) * id;
        m[8] = (a11 * a00 - a01 * a10) * id;

        return m;

    }

    this.transpose = function() {
        var d = this.data;

        var d0 = d[0], d3 = d[3], d6 = d[6],
            d1 = d[1], d4 = d[4], d7 = d[7],
            d2 = d[2], d5 = d[5], d8 = d[8];

        d[0] = d0;
        d[1] = d3;
        d[2] = d6;

        d[3] = d1;
        d[4] = d4;
        d[5] = d7;

        d[6] = d2;
        d[7] = d5;
        d[8] = d8;
    }

}SQR.Matrix44 = function() {

    this.data = new Float32Array(16);

    this.identity = function(m) {
        var d = m || this.data;
        d[0] = 1,d[4] = 0,d[8] = 0,d[12] = 0;
        d[1] = 0,d[5] = 1,d[9] = 0,d[13] = 0;
        d[2] = 0,d[6] = 0,d[10] = 1,d[14] = 0;
        d[3] = 0,d[7] = 0,d[11] = 0,d[15] = 1;
    }

    this.transformVector = function (v, pv) {
        var d = this.data;
        var x = v.x, y = v.y, z = v.z, w = v.w;
        pv = pv || v;

        pv.x = d[0] * x + d[4] * y + d[8] * z + d[12] * w;
        pv.y = d[1] * x + d[5] * y + d[9] * z + d[13] * w;
        pv.z = d[2] * x + d[6] * y + d[10] * z + d[14] * w;
        // pv.w = d[3] * x + d[7] * y + d[11] * z + d[15] * w;

        return pv;
    }

    this.multiply = function(m, d) {
        var a = this.data, b = m.data || m;

        var a00, a01, a02, a03, a04, a05, a06, a07, a08, a09, a10, a11, a12, a13, a14, a15;
        var b00, b01, b02, b03, b04, b05, b06, b07, b08, b09, b10, b11, b12, b13, b14, b15;

        a00 = a[0],a01 = a[1],a02 = a[2],a03 = a[3];
        a04 = a[4],a05 = a[5],a06 = a[6],a07 = a[7];
        a08 = a[8],a09 = a[9],a10 = a[10],a11 = a[11];
        a12 = a[12],a13 = a[13],a14 = a[14],a15 = a[15];

        b00 = b[0],b01 = b[1],b02 = b[2],b03 = b[3];
        b04 = b[4],b05 = b[5],b06 = b[6],b07 = b[7];
        b08 = b[8],b09 = b[9],b10 = b[10],b11 = b[11];
        b12 = b[12],b13 = b[13],b14 = b[14],b15 = b[15];

        a[0] = a00 * b00 + a04 * b01 + a08 * b02 + a12 * b03;
        a[1] = a01 * b00 + a05 * b01 + a09 * b02 + a13 * b03;
        a[2] = a02 * b00 + a06 * b01 + a10 * b02 + a14 * b03;
        a[3] = a03 * b00 + a07 * b01 + a11 * b02 + a15 * b03;

        a[4] = a00 * b04 + a04 * b05 + a08 * b06 + a12 * b07;
        a[5] = a01 * b04 + a05 * b05 + a09 * b06 + a13 * b07;
        a[6] = a02 * b04 + a06 * b05 + a10 * b06 + a14 * b07;
        a[7] = a03 * b04 + a07 * b05 + a11 * b06 + a15 * b07;

        a[8] = a00 * b08 + a04 * b09 + a08 * b10 + a12 * b11;
        a[9] = a01 * b08 + a05 * b09 + a09 * b10 + a13 * b11;
        a[10] = a02 * b08 + a06 * b09 + a10 * b10 + a14 * b11;
        a[11] = a03 * b08 + a07 * b09 + a11 * b10 + a15 * b11;

        a[12] = a00 * b12 + a04 * b13 + a08 * b14 + a12 * b15;
        a[13] = a01 * b12 + a05 * b13 + a09 * b14 + a13 * b15;
        a[14] = a02 * b12 + a06 * b13 + a10 * b14 + a14 * b15;
        a[15] = a03 * b12 + a07 * b13 + a11 * b14 + a15 * b15;

        return this;
    }

    this.setTQS = function(tx, ty, tz, qw, qx, qy, qz, sx, sy, sz, m) {

        var d = m || this.data;
        this.identity(m);

        var sqx = qx * qx;
        var sqy = qy * qy;
        var sqz = qz * qz;

        d[0]  = (1 - 2 * sqy - 2 * sqz) * sx;
        d[1]  = (2 * qx * qy - 2 * qz * qw) * sx;
        d[2]  = (2 * qx * qz + 2 * qy * qw) * sx;

        d[4]  = (2 * qx * qy + 2 * qz * qw) * sy;
        d[5]  = (1 - 2 * sqx - 2 * sqz) * sy;
        d[6]  = (2 * qy * qz - 2 * qx * qw) * sy;

        d[8]  = (2 * qx * qz - 2 * qy * qw) * sz;
        d[9]  = (2 * qy * qz + 2 * qx * qw) * sz;
        d[10] = (1 - 2 * sqx - 2 * sqy) * sz;

        d[12] = tx;
        d[13] = ty;
        d[14] = tz;

        return m || this;
    }

    this.setTRS = function(tx, ty, tz, rx, ry, rz, sx, sy, sz, m) {

        var d = m || this.data;
        this.identity(m);

        var six = Math.sin(rx), cox = Math.cos(rx), siy = Math.sin(ry), coy = Math.cos(ry), siz = Math.sin(rz), coz = Math.cos(rz);

        // fliping this part changes from left handed to right handed (I think)
        d[0] = (coy * coz + siy * six * siz) * sx;
        d[1] = (-coy * siz + siy * six * coz) * sx;
        d[2] = siy * cox * sx;

        d[4] = siz * cox * sy;
        d[5] = coz * cox * sy;
        d[6] = -six * sy;

        d[8] = (-siy * coz + coy * six * siz) * sz;
        d[9] = (siz * siy + coy * six * coz) * sz;
        d[10] = coy * cox * sz;

        d[12] = tx;
        d[13] = ty;
        d[14] = tz;

        return m || this;
    }

    this.setScale = function(sx, sy, sz, m) {
        var d = m || this.data;
        this.identity(m);
        d[0] = sx,d[5] = sy,d[10] = sz;
        return m || this;
    }

    this.setTranslation = function(tx, ty, tz, m) {
        var d = m || this.data;
        this.identity(m);
        d[12] = tx,d[13] = ty,d[14] = tz;
        return m || this;
    }

    this.setRotation = function(rx, ry, rz, m) {
        var d = m || this.data;
        this.identity(m);
        var sx = Math.sin(rx), cx = Math.cos(rx), sy = Math.sin(ry), cy = Math.cos(ry), sz = Math.sin(rz), cz = Math.cos(rz);

        d[0] = cy * cz + sy * sx * sz;
        d[1] = -cy * sz + sy * sx * cz;
        d[2] = sy * cx;

        d[4] = sz * cx;
        d[5] = cz * cx;
        d[6] = -sx;

        d[8] = -sy * cz + cy * sx * sz;
        d[9] = sz * sy + cy * sx * cz;
        d[10] = cy * cx;

        return m || this;
    }

    this.translate = function(tx, ty, tz) {
        this.setTranslation(tx, ty, tz, SQR.Matrix44.__temp);
        return this.multiply(SQR.Matrix44.__temp);
    }

    this.rotate = function(rx, ry, rz) {
        this.setRotation(rx, ry, rz, SQR.Matrix44.__temp);
        return this.multiply(SQR.Matrix44.__temp);
    }

    this.scale = function(sx, sy, sz) {
        this.setScale(sx, sy, sz, SQR.Matrix44.__temp);
        return this.multiply(SQR.Matrix44.__temp);
    }

    this.copyTo = function(m) {
        var a = this.data, b = m.data || m;
        for (var i = 0; i < 16; i++) b[i] = a[i];
        return m;
    }

    this.copyRotationTo = function(m) {
        var a = this.data, b = m.data || m;

        b[0] = a[0];
        b[1] = a[1];
        b[2] = a[2];

        b[3] = a[4];
        b[4] = a[5];
        b[5] = a[6];

        b[6] = a[8];
        b[7] = a[9];
        b[8] = a[10];

        return m;
    }

    var noe = function (n) {
        return Math.abs(n) < 0.000001 ? 0 : n;
    };

    this.getAsCSSProperty = function() {
        var d = this.data;
        return 'matrix3d(' +
            noe(d[0]) + ',' +
            noe(d[1]) + ',' +
            noe(d[2]) + ',' +
            noe(d[3]) + ',' +

            noe(d[4]) + ',' +
            noe(d[5]) + ',' +
            noe(d[6]) + ',' +
            noe(d[7]) + ',' +

            noe(d[8]) + ',' +
            noe(d[9]) + ',' +
            noe(d[10]) + ',' +
            noe(d[11]) + ',' +

            noe(d[12]) + ',' +
            noe(d[13]) + ',' +
            noe(d[14]) + ',' +
            noe(d[15]) +
            ')';
    }

    this.extractPosition = function(v) {
        var d = this.data;
        v.set(d[12],d[13], d[14]);
        return v;
    }

    this.determinant = function() {
        var d = this.data;

        return d[0] * (d[5] * d[10] - d[9] * d[6]) +
            d[4] * (d[9] * d[2] - d[1] * d[10]) +
            d[8] * (d[1] * d[6] - d[5] * d[2]);
    }

    this.inverse = function(m) {
        var d = this.data;
        var a = (m) ? m.data || m : this.data;
        var det = this.determinant();

        if (Math.abs(det) < 0.0001) {
            console.warn("Attempt to inverse a singular matrix44. ", this.data);
            console.trace();
            return m;
        }

        var d0 = d[0], d4 = d[4], d8 = d[8],   d12 = d[12],
            d1 = d[1], d5 = d[5], d9 = d[9],   d13 = d[13],
            d2 = d[2], d6 = d[6], d10 = d[10], d14 = d[14];

        det = 1 / det;

        a[0] = (d5 * d10 - d9 * d6) * det;
        a[4] = (d8 * d6 - d4 * d10) * det;
        a[8] = (d4 * d9 - d8 * d5) * det;

        a[1] = (d9 * d2 - d1 * d10) * det;
        a[5] = (d0 * d10 - d8 * d2) * det;
        a[9] = (d8 * d1 - d0 * d9) * det;

        a[2] = (d1 * d6 - d5 * d2) * det;
        a[6] = (d4 * d2 - d0 * d6) * det;
        a[10] = (d0 * d5 - d4 * d1) * det;

        a[12] = - (d12 * a[0] + d13 * a[1] + d14 * a[2]);
        a[13] = - (d12 * a[4] + d13 * a[5] + d14 * a[6]);
        a[14] = - (d12 * a[8] + d13 * a[9] + d14 * a[10]);

        return m;

    }

    this.transpose = function() {
        var d = this.data;

        var d0 = d[0], d4 = d[4], d8 = d[8],
            d1 = d[1], d5 = d[5], d9 = d[9],
            d2 = d[2], d6 = d[6], d10 = d[10];

        d[0] = d0;
        d[1] = d4;
        d[2] = d8;

        d[4] = d1;
        d[5] = d5;
        d[6] = d9;

        d[8] = d2;
        d[9] = d6;
        d[10] = d10;
    }

    this.lookAt = function (target, up) {
        var d = this.data;
        var x = SQR.Matrix44.__tv1;
        var y = SQR.Matrix44.__tv2;
        var z = SQR.Matrix44.__tv3;

        z.set(d[12], d[13], d[14]);
        z.sub(z, target).norm();
        if (z.magsq() === 0) z.z = 1;

        x.cross(up, z).norm();
        if (x.magsq() === 0) {
            z.x += 0.0001;
            x.cross(up, z).norm();
        }

        y.cross(z, x);

        d[0] = x.x, d[4] = y.x, d[8] = z.x;
        d[1] = x.y, d[5] = y.y, d[9] = z.y;
        d[2] = x.z, d[6] = y.z, d[10] = z.z;

        return this;
    }

    this.identity();
}


















/**
 * Creates a new 4x4 Matrix
 *
 * @class The 4x4 matrix is used mostly for perspective and orthographic projection.
 */
SQR.ProjectionMatrix = function() {
    if (typeof Float32Array == 'undefined') Float32Array = Array;
    this.data = new Float32Array(16);

    this.copyTo = function(m) {
        var a = this.data, b = m.data || m;
        for (var i = 0; i < 16; i++) b[i] = a[i];
        return m;
    }

    this.identity();
}

SQR.ProjectionMatrix.prototype.identity = function() {
    var m = this.data;
    m[0] = 1,m[1] = 0,m[2] = 0,m[3] = 0;
    m[4] = 0,m[5] = 1,m[6] = 0,m[7] = 0;
    m[8] = 0,m[9] = 0,m[10] = 1,m[11] = 0;
    m[12] = 0,m[13] = 0,m[14] = 0,m[15] = 1;
}

SQR.ProjectionMatrix.prototype.perspective = function(fov, aspect, near, far) {

    var m = this.data;
    var t = near * Math.tan(fov * Math.PI / 360);
    var n = far - near;

    m[0] = near / (t * aspect);
    m[4] = 0;
    m[8] = 0;
    m[12] = 0;

    m[1] = 0;
    m[5] = near / t;
    m[9] = 0;
    m[13] = 0;

    m[2] = 0;
    m[6] = 0;
    m[10] = -(far + near) / n;
    m[14] = -(2 * far * near) / n;

    m[3] = 0;
    m[7] = 0;
    m[11] = -1;
    m[15] = 0;

//	this.n11 = near / (t * aspect);
//	this.n22 = near / t;
//	this.n33 = -(far + near) / n;
//	this.n34 = -(2 * far * near) / n;
//	this.n43 = -1;
//	this.n44 = 0;
}

SQR.ProjectionMatrix.prototype.transformVector = function(v, pv) {
    var x = v.x, y = v.y, z = v.z, w = v.w;
    var m = this.data;
    pv = pv || v;

    pv.x = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    pv.y = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    pv.z = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
//  pv.w = d[3] * x + d[7] * y + d[11] * z + d[15] * w;

    return pv;
}

SQR.ProjectionMatrix.prototype.inverse = function (m) {
    var mat = this.data;
    m = m || this.data;

    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
        a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
        a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
        a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        d = (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06),
        invDet;

    // Calculate the determinant
    if (!d) {
        return null;
    }
    invDet = 1 / d;

    m[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
    m[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
    m[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
    m[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;

    m[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
    m[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
    m[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
    m[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;

    m[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
    m[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
    m[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
    m[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;

    m[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
    m[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
    m[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
    m[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;

    return m;
};
SQR.Quaternion = function(w, x, y, z) {
    this.set(w, x, y, z);
}

SQR.Quaternion.prototype.set = function(w, x, y, z) {
    this.w = w || 1;
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

SQR.Quaternion.prototype.copyFrom = function(q) {
    this.w = q.w;
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
}

SQR.Quaternion.prototype.identity = function() {
    this.set();
}

/**
 * Multiplies rq (or this if no rq) by q
 * @param q
 * @param rq if not defined this is multiplied by q
 */
SQR.Quaternion.prototype.mul = function(q, rq) {
    rq = rq || this;

    var w = (rq.w * q.w - rq.x * q.x - rq.y * q.y - rq.z * q.z);
    var x = (rq.w * q.x + rq.x * q.w + rq.y * q.z - rq.z * q.y);
    var y = (rq.w * q.y - rq.x * q.z + rq.y * q.w + rq.z * q.x);
    var z = (rq.w * q.z + rq.x * q.y - rq.y * q.x + rq.z * q.w);

    rq.set(w, x, y, z);

    rq.normalize();

    return rq;
}

SQR.Quaternion.prototype.lookAt = function(_dir, _up) {

        var dir = SQR.Quaternion.__tv1;
        var right = SQR.Quaternion.__tv2;
        var up = SQR.Quaternion.__tv3;

        _dir.copyTo(dir);
        _up.copyTo(up);

        dir.norm();

        // If direction is back, the returned quaternion is flipped. Not sure why, but that fixes it.
        if(dir.z == -1) {
            dir.x = 0.0001;
            dir.norm();
        }

        // Probably should do the orthonormalization but not sure how that works :)
        // tangent.sub(up, forward.mul(SQR.V3.dot(forward, up))).norm();

        right.cross(up, dir);
        up.cross(dir, right);

        this.w = Math.sqrt(1 + right.x + up.y + dir.z) * 0.5;
        var rc = 4 * this.w;
        this.x = (dir.y - up.z) / rc;
        this.y = (right.z - dir.x) / rc;
        this.z = (up.x - right.y) / rc;

        this.normalize();
    
        return this;
}

SQR.Quaternion.prototype.fromAngleAxis = function(a, x, y, z) {
    var s = Math.sin(a / 2);
    this.x = x * s;
    this.y = y * s;
    this.z = z * s;
    this.w = Math.cos(a / 2);
}

SQR.Quaternion.prototype.mag = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
}

SQR.Quaternion.prototype.normalize = function() {
    var n = this.mag();
    this.x /= n;
    this.y /= n;
    this.z /= n;
    this.w /= n;
}

SQR.Quaternion.prototype.toMatrix = function(m) {
    // Check Matrix44.TQS()
}

SQR.Quaternion.slerp = function(qa, qb, t, qr) {
    qr = qr || new SQR.Quaternion();

    var cha = qa.w * qb.w + qa.x * qb.x + qa.y * qb.y + qa.z * qb.z;
    var ha = Math.acos(cha);
    var sha = Math.sqrt(1 - cha * cha);
    var ra = Math.sin((1 - t) * ha) / sha;
    var rb = Math.sin(t * ha) / sha;

    if (Math.abs(cha) >= 1) {
        // If angle is 0 (i.e cos(a) = 1) just
        // return the first quaternion
        ra = 1;
        rb = 0;
    } else if (Math.abs(sha) < 0.001) {
        // If angle is 180 deg (i.e. sin(a) = 0) there is
        // an infinite amount of possible rotations between those 2
        ra = 0.5;
        rb = 0.5;
    }

    qr.w = (qa.w * ra + qb.w * rb);
    qr.x = (qa.x * ra + qb.x * rb);
    qr.y = (qa.y * ra + qb.y * rb);
    qr.z = (qa.z * ra + qb.z * rb);
    return qr;
}

















SQR.V2 = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

/**
 * Set the vector to the given values
 * 
 * @param x x component
 * @param y y component
 */
SQR.V2.prototype.set = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    return this;
}

/**
 * Adds two vectors. Vectors can be recylced to avoid creating vec vectors like this:
 *
 * a.sum(a, b);
 *
 * Since this method returns the current instance, method calls can be chained:
 *
 * a.sum(a, b).sum(a, c) means: a + b + c
 *
 * @param a a vector
 * @param b another vector
 * @param c an optional 3rd vector to store the
 * @returns this vector
 */
SQR.V2.prototype.add = function(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    return this;
}


SQR.V2.prototype.mul = function(s) {
    this.x *= s;
    this.y *= s;
    return this;
}

SQR.V2.prototype.magsq = function() {
    return this.x * this.x + this.y * this.y;
}

SQR.V2.prototype.mag = function() {
    return Math.sqrt(this.magsq());
}

SQR.V2.prototype.norm = function() {
    var m = this.mag();
    if(m == 0) return this;
    this.x /= m
    this.y /= m;
    return this;
}

/**
 * Subtracts this vector from v. Used to get a vector going from current to v.
 * In order to limit creation of new objects pass en existing vector as 2nd argument.
 *
 * @param v the vector to subtract from the current vector
 * @param r the resulting vector, if omitted, new vector is returned
 * @returns the resulting vector
 */
SQR.V2.prototype.sub = function(v, r) {
    r = r || new SQR.V2();
    r.x = v.x - this.x;
    r.y = v.y - this.y;
    return r;
}

/**
 * @returns true if it's a zero vector
 */
SQR.V2.prototype.isZero = function() {
    return this.x == 0 && this.y == 0;
}

/**
 * @returns a random vector where x and y are in range [-1, 1]
 */
SQR.V2.random = function() {
    return new SQR.V2(Math.random() * 2 - 1, Math.random() * 2 - 1);
}


SQR.V2.prototype.setAngleRadius = function(a, r) {
    this.x = Math.cos(a) * r;
    this.y = Math.sin(a) * r;
    return this;
}

SQR.V2.prototype.addc = function(x ,y) {
    this.x += x;
    this.y += y;
    return this;
}

SQR.V2.prototype.addAngleRadius = function(a, r) {
    this.x += Math.cos(a) * r;
    this.y += Math.sin(a) * r;
    return this;
}SQR.V3 = function(x, y, z, w) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 1;
}

SQR.V3.prototype.set = function(x, y, z, w) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 1;
    return this;
}

SQR.V3.prototype.append = function(x, y, z, w) {
    this.x += x || 0;
    this.y += y || 0;
    this.z += z || 0;
    this.w += w || 0;
    return this;
}

SQR.V3.prototype.copyTo = function(p) {
    p.x = this.x;
    p.y = this.y;
    p.z = this.z;
    p.w = this.w;
    return p;
}

SQR.V3.prototype.copy = function(v) {
    v = v || new SQR.V3();
    v.set(this.x, this.y, this.z, this.w);
    return v;
}

SQR.V3.prototype.copyFrom = function(p) {
    this.x = p.x;
    this.y = p.y;
    this.z = p.z;
    this.w = p.w;
    return this;
}

SQR.V3.prototype.magsq = function() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
};

SQR.V3.prototype.mag = function() {
    return Math.sqrt(this.magsq());
};

SQR.V3.prototype.isZero = function() {
    return this.x == 0 && this.y == 0 && this.z == 0;
};

SQR.V3.prototype.mul = function(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
}

SQR.V3.prototype.neg = function() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
}

SQR.V3.prototype.norm = function() {
    var m = 1 / this.mag();
    this.set(this.x * m, this.y * m, this.z * m);
    return this;
}

/**
 * a.add(a, b).add(a, c) -> a + b + c
 *
 * @param a
 * @param b
 */
SQR.V3.prototype.add = function(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;
    return this;
}

/**
 * a.sub(b, a) ->  a = from a to b
 *
 * @param a
 * @param b
 */
SQR.V3.prototype.sub = function(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
}

SQR.V3.dot = function(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

SQR.V3.prototype.toUniform = function() {
    return [this.x, this.y, this.z];
}

SQR.V3.prototype.cross = function(a, b) {
    var x = a.y * b.z - a.z * b.y;
    var y = a.z * b.x - a.x * b.z;
    var z = a.x * b.y - a.y * b.x;
    this.set(x, y, z, this.w);
    return this;
}

SQR.V3.up = new SQR.V3(0,1,0);
/**
 * Based on http://www.math.tamu.edu/~romwell/arcball_js/arcball.pde
 *
 * @param mx mouse X position in range [ -1 , 1 ]
 * @param my mouse Y position in range [ -1 , 1 ]
 * @param radius of the arc ball for interaction. Default value: 0.5
 */
SQR.VectorUtil = {
    mouseToUnitSphereVector: function(mx, my, gr, v) {
        gr = gr || 0.5;
        v = v || new SQR.V3();

        var px = mx / gr;
        var py = my / gr;
        var rl = px * px + py * py;

        if (rl >= 1) {
            v.set(px, py, 0);
        } else {
            v.set(px, py, Math.sqrt(1 - rl));
        }

        v.norm();

        return v;
    }
}

SQR.Quaternion.__tv1 = new SQR.V3();
SQR.Quaternion.__tv2 = new SQR.V3();
SQR.Quaternion.__tv3 = new SQR.V3();

SQR.Matrix2D.__temp = new Float32Array(9);
SQR.Matrix33.__temp = new Float32Array(9);
SQR.Matrix44.__temp = new Float32Array(16);

SQR.Matrix44.__tv1 = new SQR.V3();
SQR.Matrix44.__tv2 = new SQR.V3();
SQR.Matrix44.__tv3 = new SQR.V3();

SQR.VectorUtil.__tv1 = new SQR.V3();
SQR.VectorUtil.__tv2 = new SQR.V3();
SQR.VectorUtil.__tv3 = new SQR.V3();SQR.Geometry = function() {

    /**
     * Array of SQR.2D or SQR.3D used as vertices
     */
    this.vertices = null;

    /**
     * Array of SQR.Face used to secribe a triangle mesh
     */
    this.triangles = null;

    /**
     * Array or numbers or color strings used to define color per-vertex
     */
    this.colors = null;

    /**
     * Array or <img> or <canvas> elements use as texture per-vertex
     */
    this.particleTextures = null;

    /**
     * Array of normals per polygon
     */
    this.normals = null;

}

SQR.Geometry.prototype.addTriangle = function(a, b, c, color) {
    if(!this.triangles) this.triangles = [];
    this.triangles.push(new SQR.Triangle(a, b, c, color));
}

SQR.Geometry.prototype.addSegment = function(a, b, color) {
    if(!this.vertices) this.vertices = [];
    if(!this.colors) this.colors = [];

    this.vertices.push(a, b);
    this.colors.push(color);
}SQR.Squareroot = function(canvas, divContainer) {

    var uniforms = {};
    if(canvas) uniforms.context = canvas.getContext("2d");
    uniforms.projection = new SQR.ProjectionMatrix();
    uniforms.container = divContainer;

    uniforms.lightDirection = new SQR.V3(0, 1, 0.1).norm();

    var clearColor = null;

    this.setBackground = function(c) {
        if(canvas) canvas.style.backgroundColor = c;
    }

    this.setClearColor = function(c) {
        clearColor = c;
    }

    this.setProjection = function(fov) {
        uniforms.cssDistance = 0.5 / Math.tan(fov * Math.PI / 360) * uniforms.height;
        uniforms.projection.perspective(fov, uniforms.width / uniforms.height, 0.1, 1000);

        if (divContainer) {
            divContainer.style['perspective'] = uniforms.cssDistance + 'px';
            divContainer.style['-webkit-perspective'] = uniforms.cssDistance + 'px';
            divContainer.style['-moz-perspective'] = uniforms.cssDistance + 'px';
            divContainer.style['-o-perspective'] = uniforms.cssDistance + 'px';
        }
    }

	this.setPerspectiveOrigin = function(x, y) {
		if (divContainer) {
			divContainer.style['perspective-origin'] = x + 'px ' + y + 'px';
            divContainer.style['-webkit-perspective-origin'] = x + 'px ' + y + 'px';
            divContainer.style['-moz-perspective-origin'] = x + 'px ' + y + 'px';
            divContainer.style['-o-perspective-origin'] = x + 'px ' + y + 'px';
		}
	}

    this.cssDistance = function() {
        return uniforms.cssDistance;
    }

    this.setSize = function(w, h) {
        uniforms.width = w;
        uniforms.height = h;

        if(canvas) {
            canvas.width = w;
            canvas.height = h;
        }
        
        uniforms.aspect = w / h;
        uniforms.centerX = w * 0.5;
        uniforms.centerY = h * 0.5;
    }

    this.children = [];
    this.numChildren = 0;

    var renderObjects = [];

    this.add = function() {
        for (var i = 0; i < arguments.length; i++) {
            var t = arguments[i];
            if (this.children.indexOf(t) == -1) this.children.push(t);
        }
        this.numChildren = this.children.length;
    }

    this.removeAll = function() {
        this.children = [];
        this.numChildren = this.children.length;
    }

    var updateTransform = function(t) {
        if(t.renderer) {
            if(t.renderer.isDom3d && SQR.usePreserve3d && t.parent && t.parent.renderer && t.parent.renderer.isDom3d) {
                t.renderer.appendToDom(t.parent.renderer.element);
            } else if(t.renderer.isDom2d || t.renderer.isDom3d) {
                t.renderer.appendToDom(divContainer);
            }
        }

        t.transformWorld();
        renderObjects.push(t);

        if (t.numChildren > 0) {
            for (var i = 0; i < t.numChildren; i++) {
                updateTransform(t.children[i]);
            }
        }
    }

    this.render = function(camera) {

        SQR.Time.tick();

        renderObjects.length = 0;

        if(!!uniforms.context) {
            uniforms.context.setTransform(1, 0, 0, 1, 0, 0);

            if (clearColor != null) {
                uniforms.context.fillStyle = clearColor;
                uniforms.context.fillRect(0, 0, canvas.width, canvas.height);
            } else {
                uniforms.context.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        for (var i = 0; i < this.numChildren; i++) {
            var t = this.children[i];
            updateTransform(t);
        }

        var l = renderObjects.length, c;

        uniforms.camera = camera;
        uniforms.viewMatrix = camera.computeInverseMatrix();

        for (var i = 0; i < l; i++) {
            c = renderObjects[i];
            c.transformView(uniforms.viewMatrix);
        }

        renderObjects.sort(function(a, b) {
            var ad = a.depth();
            var bd = b.depth();
            if (ad < bd) return -1;
            if (ad > bd) return 1;
            return 0;
        });

        for (var i = 0; i < l; i++) {
            c = renderObjects[i];

            if (c.renderer) {
                uniforms.depth = i;
                c.renderer.draw(c, uniforms);
            }
        }
    }
}SQR.Transform = function(n) {

    this.name = n;
    this.directMatrixMode = false;
    this.useQuaternion = false;
    this.cssPreserve3dMode = false;

    this.renderer = null;
    this.geometry = null;
    this.parent = null;
    this.engine = null;

    this.position = new SQR.V3();
    this.rotation = new SQR.V3();
    this.rotationQ = new SQR.Quaternion();
    this.scale = new SQR.V3(1, 1, 1);

    var _globalPosition = new SQR.V3();

    this.matrix = new SQR.Matrix44();
    this.globalMatrix = new SQR.Matrix44();
    this.inverseWorldMatrix = new SQR.Matrix44();

    this.depth = function() {
        return this.globalMatrix.data[14]; // t.z
    }

    this.children = [];
    this.numChildren = 0;

    this.add = function() {
        for (var i = 0; i < arguments.length; i++) {
            var t = arguments[i];
            t.parent = this;
            if (this.children.indexOf(t) == -1) this.children.push(t);
        }
        this.numChildren = this.children.length;
    }

    this.remove = function() {
        for (var i = 0; i < arguments.length; i++) {
            var t = arguments[i];
            var j = this.children.indexOf(t);

            if (j == -1) return false;

            t.parent = null;

            if(t.renderer && (t.renderer.isDom2d || t.renderer.isDom3d)) {
                t.removeFromDom();
            }
            

            this.children.splice(j, 1);
        }

        this.numChildren = this.children.length;
    }

    this.contains = function(t) {
        return this.children.indexOf(t) > -1;
    }

    this.removeAll = function() {
        for (var i = 0; i < this.numChildren; i++) {
            var t = this.children[i];
            t.parent = null;

            if(t.renderer && (t.renderer.isDom2d || t.renderer.isDom3d)) {
                t.removeFromDom();
            }
        }

        this.children = [];
        this.numChildren = this.children.length;
    }

    this.transformWorld = function() {

        this.cssPreserve3dMode = SQR.usePreserve3d
            && this.renderer && this.renderer.isDom3d
            && this.parent && this.parent.renderer && this.parent.renderer.isDom3d;

        if (!this.directMatrixMode) {

            var p = this.position;
            var q = this.rotationQ;
            var r = this.rotation;
            var s = this.scale;

            if(this.useQuaternion)
                this.matrix.setTQS(p.x, p.y, p.z, q.w, q.x, q.y, q.z, s.x, s.y, s.z);
            else
                this.matrix.setTRS(p.x, p.y, p.z, r.x, r.y, r.z, s.x, s.y, s.z);
        }

        if (this.lookDirection) {
            this.matrix.lookAt(this.lookDirection, SQR.V3.up);
        }

        if (this.parent && !this.cssPreserve3dMode) {
            this.parent.globalMatrix.copyTo(this.globalMatrix);
            this.globalMatrix.multiply(this.matrix);
        } else {
            this.matrix.copyTo(this.globalMatrix);
        }

        if (this.lookTarget) {
            this.globalMatrix.lookAt(this.lookTarget.globalPosition(), SQR.V3.up);
        }
    }

    this.globalPosition = function() {
        this.globalMatrix.extractPosition(_globalPosition);
        return _globalPosition;
    }

    this.transformView = function(v) {
        if(this.cssPreserve3dMode) return;
        this.globalMatrix.copyTo(this.matrix);
        v.copyTo(this.globalMatrix);
        this.globalMatrix.multiply(this.matrix);
    }

    this.lookAt = function(target) {
        this.lookTarget = target;
    }

    this.lookInDirection = function(direction) {
        this.lookDirection = direction;
    }

    this.computeInverseMatrix = function() {
        this.globalMatrix.copyTo(this.inverseWorldMatrix);
        this.inverseWorldMatrix.transpose();
        this.inverseWorldMatrix.inverse();
        return this.inverseWorldMatrix;
    }
}
SQR.Particle2D = function(texture) {

    this.transform = new SQR.Matrix2D();
    this.texture = texture;
    this.width = texture.width;
    this.height = texture.height;

    this.position = new SQR.V2(0, 0);
    this.rotation = 0;
    this.scale = new SQR.V2(1, 1);
}

SQR.Particle2D.prototype = {

    render: function(ctx) {
        var p = this.position;
        var r = this.rotation;
        var s = this.scale;

        this.transform.setTRS(p.x, p.y, r, s.x, s.y);

        var t = this.transform.data;
        ctx.setTransform(t[0], t[1], t[3], t[4], t[2], t[5]);
        ctx.drawImage(this.texture, this.width * -0.5, this.height * -0.5);
    }
}SQR.Plane = function(w, h, wd, hd, wo, ho, yup) {
    this.triangles = [];

    wo = wo || 0;
    ho = ho || 0;

    wd = wd || 1;
    hd = hd || 1;

    w = w * 0.5;
    h = h * 0.5;

    var wStart = -w + wo;
    var hStart = -h + ho;

    var wb = (w * 2) / wd;
    var hb = (h * 2) / hd;

    var i, j;

    for (i = 0; i < wd; i++) {
        for (j = 0; j < hd; j++) {

            var bvStart = wStart + i * wb;
            var bvEnd = bvStart + wb;
            var bhStart = hStart + j * hb;
            var bhEnd = bhStart + hb;

            var va, vb, vc, vd;

            if (yup) {
                va = new SQR.V3(bvStart, 0, bhStart);
                vb = new SQR.V3(bvEnd, 0, bhStart);
                vc = new SQR.V3(bvEnd, 0, bhEnd);
                vd = new SQR.V3(bvStart, 0, bhEnd);
            } else {
                va = new SQR.V3(bvStart, bhStart, 0);
                vb = new SQR.V3(bvEnd, bhStart, 0);
                vc = new SQR.V3(bvEnd, bhEnd, 0);
                vd = new SQR.V3(bvStart, bhEnd, 0);

            }

            var color = new SQR.Color(0, 100, 70);
            this.triangles.push(new SQR.Triangle(va, vb, vc, color));
            this.triangles.push(new SQR.Triangle(va, vc, vd, color));
        }
    }

    this.applyHeightMap = function(heightMap, maxHeight, offset, range) {

        var numTriangles = this.triangles.length;
 
        var processVertex = function(t) {
            var row = (t.z / h + 1) / 2;
            var col = (t.x / w + 1) / 2;

            row = (offset + row * range) % 1;

            var hl = SQR.CanvasUtil.getPixelNormRed(heightMap, col, row) / 255 * maxHeight;
            t.y = maxHeight - hl;


        }

        for (var i = 0; i < numTriangles; i++) {
            var t = this.triangles[i];
            processVertex(t.a);
            processVertex(t.b);
            processVertex(t.c);
        }
    }
}SQR.Triangle = function(a, b, c, color) {

    var that = this;

    this.a = a;
    this.b = b;
    this.c = c;

    this.color = color;

    this.sa = new SQR.V3();
    this.sb = new SQR.V3();
    this.sc = new SQR.V3();

    this.normal = new SQR.V3();

    this.center = new SQR.V3();
    this.depth = 0;

    var calculateNormal = function() {
        var a = SQR.VectorUtil.__tv1;
        var b = SQR.VectorUtil.__tv2;

        a.sub(that.sa, that.sb);
        b.sub(that.sa, that.sc);

        that.normal.cross(a, b).norm();
    }

    this.update = function(mvp, centerX, centerY) {
        this.a.copyTo(this.sa);
        this.b.copyTo(this.sb);
        this.c.copyTo(this.sc);

        mvp.transformVector(this.sa);
        mvp.transformVector(this.sb);
        mvp.transformVector(this.sc);

        this.center.set(0,0,0).add(this.sa, this.sb).add(this.center, this.sc).mul(1/3);
        this.depth = this.center.z;

        this.sa.x = this.sa.x / this.sa.z * centerX + centerX;
        this.sa.y = this.sa.y / this.sa.z * centerY + centerY;

        this.sb.x = this.sb.x / this.sb.z * centerX + centerX;
        this.sb.y = this.sb.y / this.sb.z * centerY + centerY;

        this.sc.x = this.sc.x / this.sc.z * centerX + centerX;
        this.sc.y = this.sc.y / this.sc.z * centerY + centerY;

        calculateNormal();
    }
}SQR.DOMElement2D = function(element) {

    // Used to identify the type of the renderer instead of using insfanceof
    this.isDom2d = true;

    this.element = element;
    var addedToDom = false;
    var container = null;

    var matrix2D = new SQR.Matrix2D();
    var mvp = new SQR.Matrix44();

    // Do not call this functions directly
    this.appendToDom = function(c) {
        if (addedToDom && c == container) return;
        container = c;
        container.appendChild(this.element);
        addedToDom = true;
    }

    this.removeFromDom = function() {
        container.removeChild(this.element);
    }

    this.draw = function(transform, uniforms) {
        uniforms.projection.copyTo(mvp);
        mvp.multiply(transform.globalMatrix);

        var p = new SQR.V3(0, 0, 0);

        mvp.transformVector(p);

        p.x = p.x / p.z * uniforms.centerX;
        p.y = p.y / p.z * uniforms.centerY;

        var s = 1 / (p.z / uniforms.cssDistance);
        var r = transform.rotation.z;

        matrix2D.setTRS(p.x, p.y, r, s, s);

        var t3d = (SQR.supportsCss3d) ? SQR.DOMUtil.translate3dCss(0, 0, 0) : '';
        var m = t3d + matrix2D.getAsCSSProperty(false);

        element.style.zIndex = uniforms.depth;
        element.style['transform'] = m;
        element.style['-webkit-transform'] = m;
        element.style['-moz-transform'] = m;
        element.style['-o-transform'] = m;
        element.style['-ms-transform'] = m;
        element.style['display'] = (p.z <= 0) ? 'none' : 'block';
    }
}SQR.DOMElement3D = function(element) {

    // Used to identify the type of the renderer instead of using insfanceof
    this.isDom3d = true;

    this.element = element;
    var addedToDom = false;
    var container = null;

    this.setBackfaceVisibility = function(visible) {
        var p = (visible) ? 'visible' : 'hidden';
        element.style['backface-visibility'] = p;
        element.style['-webkit-backface-visibility'] = p;
        element.style['-moz-backface-visibility'] = p;
        element.style['-ms-backface-visibility'] = p;
        element.style['-o-backface-visibility'] = p;
    }

    // Do not call this functions directly
    this.appendToDom = function(c) {
        if (addedToDom && c == container) return;
        container = c;
        container.appendChild(this.element);
        addedToDom = true;
    }

    this.removeFromDom = function() {
        container.removeChild(this.element);
    }

    this.setBackfaceVisibility = function() {
        //empty function just to prevent needing logic for 2d/3d
    }

    this.draw = function(transform, uniforms) {
        var t3d = (transform.cssPreserve3dMode) ? '' : SQR.DOMUtil.translate3dCss(0, 0, uniforms.cssDistance);
        var ps = 'perspective(' + uniforms.cssDistance + 'px)';

        var p = t3d + ' ' + transform.globalMatrix.getAsCSSProperty();

        element.style.zIndex = uniforms.depth;
        element.style['transform'] = ps + p;
        element.style['-webkit-transform'] = p;
        element.style['-moz-transform'] = ps + p;
        element.style['-ms-transform'] = ps + p;
        element.style['-o-transform'] = ps + p; // TODO: to ps or not ps in Opera?

    }
}SQR.Particle = function(radius, fill, stroke) {

    var p = new SQR.V3();
    var mvp = new SQR.Matrix44();

    this.draw = function(transform, uniforms) {
        var ctx = uniforms.context;
        var geo = transform.geometry;

        uniforms.projection.copyTo(mvp);
        mvp.multiply(transform.globalMatrix);

        for (var i = 0; i < geo.vertices.length; i++) {
            geo.vertices[i].copyTo(p);

            mvp.transformVector(p);

            if(p.z < 0) continue;

            p.x = p.x / p.z * uniforms.centerX + uniforms.centerX - radius;
            p.y = p.y / p.z * uniforms.centerY + uniforms.centerY - radius;

            ctx.drawImage(geo.particleTextures[i], p.x, p.y);
        }
    }

}SQR.Polygon = function() {


    var mvp = new SQR.Matrix44();
    var p = new SQR.V3();

    this.draw = function(transform, uniforms) {
        var ctx = uniforms.context;
        var geo = transform.geometry;

        uniforms.projection.copyTo(mvp);
        mvp.multiply(transform.globalMatrix);

        var i, t, tris = geo.triangles.length;

        for (i = 0; i < tris; i++) {
            t = geo.triangles[i];
            t.update(mvp, uniforms.centerX, uniforms.centerY);
        }

        geo.triangles.sort(function(a, b) {
            var ad = a.depth;
            var bd = b.depth;
            if (ad < bd) return 1;
            if (ad > bd) return -1;
            return 0;
        });

        for (i = 0; i < tris; i++) {
            t = geo.triangles[i];

            var l = Math.max(0, SQR.V3.dot(t.normal, uniforms.lightDirection));
            var c = t.color.applyLight(l);

            ctx.fillStyle = c;
            ctx.beginPath();
            ctx.moveTo(t.sa.x, t.sa.y);
            ctx.lineTo(t.sb.x, t.sb.y);
            ctx.lineTo(t.sc.x, t.sc.y);
            ctx.closePath();
            ctx.fill();
        }


    }

}SQR.Segment = function(thickness) {

    this.culling = false;

    var ps = new SQR.V3();
    var pe = new SQR.V3();
    var mvp = new SQR.Matrix44();

    var front = new SQR.V3(0, 0, 1);
    var dir = new SQR.V3();

    this.draw = function(transform, uniforms) {
        var ctx = uniforms.context;
        var geo = transform.geometry;

        uniforms.projection.copyTo(mvp);
        mvp.multiply(transform.globalMatrix);

        //var r = 0;

        for (var i = 0; i < geo.vertices.length; i += 2) {
            geo.vertices[i].copyTo(ps);
            geo.vertices[i + 1].copyTo(pe);

            mvp.transformVector(ps);
            mvp.transformVector(pe);

            if (ps.z < 0 || pe.z < 0) continue;

            dir.sub(ps, pe).norm();
            if (SQR.V3.dot(dir, front) < 0 && this.culling) continue;
            
            //r++;

            ps.x = ps.x / ps.z * uniforms.centerX + uniforms.centerX;
            ps.y = ps.y / ps.z * uniforms.centerY + uniforms.centerY;

            pe.x = pe.x / pe.z * uniforms.centerX + uniforms.centerX;
            pe.y = pe.y / pe.z * uniforms.centerY + uniforms.centerY;

            //console.log(ctx, ps.x, ps.y, pe.x, pe.y, geo.vertexColors[ i/2 | 0 ], thickness);

            ctx.strokeStyle = geo.colors[ i / 2 | 0 ];
            ctx.lineWidth = thickness;
            ctx.beginPath();
            ctx.moveTo(ps.x, ps.y);
            ctx.lineTo(pe.x, pe.y);
            // ctx.closePath();
            ctx.stroke();
        }

        //document.getElementById('debug').innerHTML = "Lines rendered: " + r;
    }
}SQR.CanvasUtil = {

    getPixel: function(imageData, x, y) {
        var i = (y * imageData.width + x) * 4;
        return [ imageData.data[i+0], imageData.data[i+1], imageData.data[i+2], imageData.data[i+3] ];
    },

    getPixelRed: function(imageData, x, y) {
        return imageData.data[ (y * imageData.width + x) * 4 ];
    },

    getPixelNormRed: function(imageData, nx, ny) {
        var x = nx * (imageData.width-1) | 0;
        var y = ny * (imageData.height-1) | 0;

        var i = y * imageData.width + x;
        return imageData.data[ i * 4 ];
    }
    
};SQR.DOMUtil = {

    isElement: function(o) {
        return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
                o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName === "string"
            );
    },

    translate3dCss: function(x, y, z) {
        return ' translate3d(' + x + 'px,' + y + 'px,' + z + 'px)';
    },

    translate2dCss: function(x, y, z) {
        return ' translate(' + x + 'px,' + y + 'px)';
    },

    rotate3dCss: function(x, y, z) {
        return ' rotateX(' + x + 'deg) rotateY(' + y + 'deg) rotateZ(' + z + 'deg)';
    }
}SQR.Stringify = {

    v2: function(v) {
        return v.x + " | " + v.y;
    },

    v3: function(v) {
        return v.x + " | " + v.y + " | " + v.z;
    },

    q: function(q) {
        return q.w + " || " + q.x + " | " + q.y + " | " + q.z;
    },

    m33: function(m) {
        var d = m.data || m;

        return d[0] + "\t|\t" + d[1] + "\t|\t" + d[2] + "\n" +
               d[3] + "\t|\t" + d[4] + "\t|\t" + d[5] + "\n" +
               d[6] + "\t|\t" + d[7] + "\t|\t" + d[8] + "\n";
    },

    m44: function(m) {
        var d = m.data || m;

        var f = function(i) {
            var r = ((Math.abs(d[i]) > 0.0001) ? d[i] : 0);

            r = r.toPrecision(3);

            return r;
        }

        return f(0) + "\t|\t" + f(4) + "\t|\t" + f(8)  + "\t|\t" + f(12) + "\n" +
               f(1) + "\t|\t" + f(5) + "\t|\t" + f(9)  + "\t|\t" + f(13) + "\n" +
               f(2) + "\t|\t" + f(6) + "\t|\t" + f(10) + "\t|\t" + f(14) + "\n" +
               f(3) + "\t|\t" + f(7) + "\t|\t" + f(11) + "\t|\t" + f(15) + "\n";
    }

}SQR.Time = {}

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
