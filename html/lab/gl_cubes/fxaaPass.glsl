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

//#include fxaa

uniform sampler2D uTexture;
varying vec2 vUV;



void main(void) {
    vec3 c = fxaa(uTexture, gl_FragCoord.xy).rgb;
    // vec3 c = texture2D(uTexture, vUV).rgb;
    gl_FragColor = vec4(c, 1.0);
}