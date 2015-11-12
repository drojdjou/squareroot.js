//#name point.glsl
//#vertex
attribute vec3 aPosition;
attribute vec3 aColor;
attribute float aSpeed;

uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform float uTime;

varying vec3 vColor;

   
void main() {
	vColor = aColor;

	vec3 p = aPosition;

	p.x += uTime * (0.0001 + aSpeed);
	p.y += cos(uTime * 12.0 * aSpeed) * 40.0 * aSpeed;

	p.x = -1.0 + mod(p.x, 2.0);

	gl_Position = uProjection * uViewMatrix * vec4(p, 1.0);
	gl_PointSize = 2.0;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

varying vec3 vColor;
      
void main() {
	gl_FragColor = vec4(vColor, 1.0);
}