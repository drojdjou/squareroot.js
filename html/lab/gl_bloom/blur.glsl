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

#ifndef ITE
#define ITE 16.0
#endif

uniform sampler2D uTexture;
uniform vec2 uDelta;

varying vec2 vUV;

float random(vec3 scale, float seed) {
    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 675.5453 + seed);
}

void main(void) {
    float offset = random(vec3(24.6546, 13.4905, 210.8789), 2.0);
    vec4 c = vec4(0.0);
    float ws = 0.0;

    float d;

    vec4 col = texture2D(uTexture, vUV);

	for(float t = -ITE; t <= ITE; t++) {
        float p = (t + offset - 0.5) / 16.0;
        float w = 1.0 - abs(p);
        c += texture2D(uTexture, vUV + uDelta * p) * w;
        ws += w;
    }

	gl_FragColor = vec4(c.rgb / ws, 1.0);
	
}