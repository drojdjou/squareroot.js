// normal2color.glsl
//#vertex
attribute vec3 aPosition;
attribute float aBirth;
attribute float aSize;
attribute vec3 aEnergy;
attribute vec3 aColor;

uniform float uTime;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;

uniform vec3 uGravity;

varying float vLife;
varying vec3 vColor;

const float timescale = 0.01;

void main() {
	float l = uTime - aBirth;
	vLife = max(0.0, 1.0 - l / 2000.0);

	vec3 g = uGravity;
	g.y += aSize * -0.002;
	g *= l;

	vColor = aColor;

	vec3 p = aPosition + l * aEnergy + g;
	gl_Position = uProjection * uViewMatrix * vec4(p, 1.0);
	gl_PointSize = 3.0 + aSize * 6.0;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uTexture;
uniform float uTime;

varying float vLife;
varying vec3 vColor;

void main() {
	vec4 c = texture2D(uTexture, gl_PointCoord);
	gl_FragColor = vec4(vColor * (vLife + 1.0), vLife * c.a * 0.5);
	// gl_FragColor = vec4(1.0, 1.0, 1.0, uLife);
}






