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

uniform float uDayTime;
uniform float uDark;
uniform float uSize;
uniform sampler2D uRamp1;
uniform sampler2D uRamp2;

varying vec3 vPosition;

void main(void) {
	float y = (normalize(vPosition).y + uSize) / (uSize * 2.0);

	vec3 c1 = texture2D(uRamp1, vec2(0.0, y)).rgb;
	vec3 c2 = texture2D(uRamp2, vec2(0.0, y)).rgb;
	gl_FragColor = vec4(mix(c1, c2, uDayTime) * uDark, 1.0);
}