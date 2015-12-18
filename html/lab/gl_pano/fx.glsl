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
varying vec2 vUV;

uniform vec2 uChromAb;

void main(void) {
	float d = length(vUV - vec2(0.5));
	d = smoothstep(0.4, 0.7, d);

	vec2 c = uChromAb * d;

	float r = texture2D(uTexture, vUV).r;
	float g = texture2D(uTexture, vUV + c).g;
	float b = texture2D(uTexture, vUV - c).b;

	vec3 col = vec3(r, g, b) * (1.0 - d * 0.5);

	gl_FragColor = vec4(col, 1.0);
}