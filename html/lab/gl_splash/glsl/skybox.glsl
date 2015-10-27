//#name rampSkybox
//#vertex
attribute vec3 aPosition;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform vec3 uEyePosition;

varying vec3 vPosition;

void main(void) {
	vPosition = aPosition;
	gl_Position = uProjection *  uViewMatrix * vec4(uEyePosition + aPosition, 1.0);	
}

//#fragment
#ifdef GL_ES
precision mediump float;
#endif

uniform float uSize;
uniform sampler2D uRamp;

varying vec3 vPosition;


void main(void) {
	vec3 np = normalize(vPosition);
	float y = np.y * 0.5 + 0.5;
	vec3 c = texture2D(uRamp, vec2(0.5, y)).rgb;
	gl_FragColor = vec4(c, 1.0);
}