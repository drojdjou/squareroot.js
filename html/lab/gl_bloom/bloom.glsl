//#vertex
precision mediump float;
attribute vec2 aPosition;
attribute vec2 aUV;

varying vec2 vUV;

void main(void) {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    vUV = aUV;  
}

//#fragment
precision mediump float;
uniform sampler2D uTexture;
uniform sampler2D uBlurTexture;
varying vec2 vUV;

void main(void) {
    vec3 c = texture2D(uTexture, vUV).rgb;
    vec3 b = texture2D(uBlurTexture, vUV).rgb;
    gl_FragColor = vec4(max(c, b), 1.0);
}