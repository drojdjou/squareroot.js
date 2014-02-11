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

#ifndef ITE
#define ITE 8.0
#endif

uniform sampler2D uTexture;
uniform vec2 delta;
uniform float uMult;

varying vec2 vTextureCoord;

float random(vec3 scale, float seed) {
    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 675.5453 + seed);
}

void main(void) {
    float offset = random(vec3(24.6546, 13.4905, 210.8789), 2.0);
    vec4 c = vec4(0.0);
    float ws = 0.0;



	for(float t = -ITE; t <= ITE; t++) {
        float p = (t + offset - 0.5) / 16.0;
        float w = 1.0 - abs(p);
        c += texture2D(uTexture, vTextureCoord + delta * p) * w;
        ws += w;
    }


	gl_FragColor = vec4(c.rgb / ws * uMult, 1.0);
	
}