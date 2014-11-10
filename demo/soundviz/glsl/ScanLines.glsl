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

uniform float uTime;
uniform float uWidth;

uniform sampler2D uTexture;
uniform sampler2D uDepthTexture;

varying vec2 vTextureCoord;

void main(void) {

    float depth = texture2D(uDepthTexture, vTextureCoord).b;

    float colorR = texture2D(uTexture, vTextureCoord + vec2(0.0, 0.02)).r;
    float colorG = texture2D(uTexture, vTextureCoord).g;
    float colorB = texture2D(uTexture, vTextureCoord + vec2(-0.04, -0.0)).b;

    vec3 color = vec3(colorR, colorG, colorB);

    float freq = 40.0;
    float w = 0.1 + uWidth * 0.8 + depth * 0.1;
    float line = step(1.0 - w, fract((vTextureCoord.y + uTime * 0.05 + depth * 0.1) * freq));

    vec3 finalColor = mix(vec3(0), color, line);

    gl_FragColor = vec4(finalColor, 1.0);
}