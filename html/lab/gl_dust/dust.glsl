// normal2color.glsl
//#vertex
attribute vec2 aPosition;
attribute float aBirth;
attribute float aSize;
attribute vec2 aEnergy;

uniform float uTime;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;

uniform vec2 uGravity;

varying float vLife;

const float timescale = 0.01;

void main() {
	float l = uTime - aBirth;
	vLife = max(0.0, 1.0 - l / 3000.0);

	vec2 g = uGravity;
	g.y += aSize * 0.01;
	g *= l;

	vec2 p = aPosition + l * aEnergy + g * g;
	gl_Position = uProjection * uViewMatrix * vec4(p, 0.0, 1.0);
	gl_PointSize = 2.0 + aSize * 8.0;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uTexture;
uniform float uTime;

varying float vLife;

void main() {
	vec4 c = texture2D(uTexture, gl_PointCoord);
	gl_FragColor = vec4(c.rgb, vLife * c.a * 0.5);
	// gl_FragColor = vec4(1.0, 1.0, 1.0, uLife);
}






