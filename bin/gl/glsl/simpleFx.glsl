//#name PlasmaEffect
//#author bartekd

//#vertex
precision mediump float;

// uniform float uTime;
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

varying vec2 vTextureCoord;

void main(void) {
    gl_Position = vec4(aVertexPosition, 0.0, 1.0);
    vTextureCoord = aTextureCoord;  
}

//#fragment
precision mediump float;

// uniform float uTime;
uniform sampler2D uTexture;
varying vec2 vTextureCoord;

void main(void) {
    // vec2 ca = vec2(0.1, 0.2);
    // vec2 cb = vec2(0.7, 0.9);
    // float da = distance(vTextureCoord, ca);
    // float db = distance(vTextureCoord, cb);

    // float t = uTime * 0.1;

    // float c1 = sin(da * cos(t) * 16.0 + t * 4.0);
    // float c2 = cos(vTextureCoord.y * 8.0 + t);
    // float c3 = cos(db * 14.0) + sin(t);

    // float p = (c1 + c2 + c3) / 3.0;

    // gl_FragColor = texture2D(uTexture, vec2(p, p));

    // gl_FragColor = vec4(vTextureCoord, 1.0, 1.0);

    vec3 c = texture2D(uTexture, vTextureCoord).rgb;
    c = vec3(1) - c;

    gl_FragColor = vec4(c, 1.0);
}