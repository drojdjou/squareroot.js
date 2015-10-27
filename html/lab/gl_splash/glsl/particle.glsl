// normal2color.glsl
//#vertex
attribute float aAngle;
attribute vec3 aVelocity;
attribute vec3 aColor;

uniform float uTime;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;

uniform float uRadius;

varying vec3 vColor;

void main() {

	vColor = aColor;

	float my = 25.0 + 120.0 * aVelocity.z;

	float a = aAngle + uTime * 0.0003 * aVelocity.x;
	float y = my + cos(aVelocity.y + uTime * 0.004 * aVelocity.y) * my * 0.5;
	float z = 60.0 + cos(aVelocity.y + uTime * 0.002 * aVelocity.z) * 30.0;
	vec3 p = vec3(sin(a) * uRadius, y, cos(a) * uRadius + z);

	gl_Position = uProjection * uViewMatrix * vec4(p, 1.0);
	gl_PointSize = POINT_SIZE;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uTexture;
uniform float uTime;

varying vec3 vColor;

void main() {
	vec4 c = texture2D(uTexture, gl_PointCoord);
	gl_FragColor = vec4(vColor, c.r);
}
