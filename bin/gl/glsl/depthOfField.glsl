//#vertex
precision mediump float;


attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

varying vec2 vTextureCoord;

void main(void) {
    gl_Position = vec4(aVertexPosition, 0.0, 1.0);
    vTextureCoord = aTextureCoord;  
}

//#fragment
precision mediump float;

uniform sampler2D uTexture;
uniform sampler2D uBlurTexture;
uniform sampler2D uDepthTexture;

varying vec2 vTextureCoord;

void main(void) {

    float depth = texture2D(uDepthTexture, vTextureCoord).b;
    float depthAlpha = texture2D(uDepthTexture, vTextureCoord).a;
    vec3 blur = texture2D(uBlurTexture, vTextureCoord).rgb;
    vec3 color = texture2D(uTexture, vTextureCoord).rgb;

    // float rdepth = smoothstep(0.0, 1.0, 1.0 - depth);


    vec3 finalColor = mix(blur, color, depth);

    // finalColor *= min(1.0, 0.5 + depth * 0.5); 
    // if(depth > 0.1) gl_FragColor = vec4(1.0, 0, 0, 1.0);
    // else 

    gl_FragColor = vec4(finalColor, 1.0);
}