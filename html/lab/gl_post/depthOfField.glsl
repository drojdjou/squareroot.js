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
uniform sampler2D uDepthTexture;

varying vec2 vUV;



void main(void) {

    float depth = texture2D(uDepthTexture, vUV).b;
    vec3 blur = texture2D(uBlurTexture, vUV).rgb;
    vec3 color = texture2D(uTexture, vUV).rgb;

    // vec3 finalColor = mix(blur, color, depth);
    vec3 finalColor = mix(blur, color, 1.0 - depth);

    gl_FragColor = vec4(finalColor, 1.0);
}