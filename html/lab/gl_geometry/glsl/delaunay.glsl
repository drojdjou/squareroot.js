//#vertex
attribute vec3 aPosition;
attribute vec3 aCentroid;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;

uniform float uTime;

varying vec3 vCentroid;
varying vec3 vUV;

void main() {
	vUV = aPosition;
	vCentroid = aCentroid;
	vec3 p = aPosition;

	gl_Position = uProjection * uViewMatrix * vec4(p, 1.0);
	gl_PointSize = 3.0;
}

//#fragment
precision highp float;

varying vec3 vCentroid;
varying vec3 vUV;

uniform sampler2D uTexture;

void main() {

	vec3 t = texture2D(uTexture, vCentroid.xy).rgb;
	// vec3 c = texture2D(uTexture, vUV.xy).rgb;
	// gl_FragColor = vec4(mix(c, t, 1.0), 1.0);
	gl_FragColor = vec4(t, 1.0);
}