// normal2color.glsl
//#vertex
attribute float aAngle;
attribute float aRadius;
attribute float aSpeed;

uniform float uTime;
uniform float uAspect;
   
void main() {
	float a = aAngle + aSpeed * uTime * 0.0003;
	float r = aRadius + aRadius * 0.2 * sin(uTime * aSpeed * 0.002);
	gl_Position = vec4(cos(a) * r * uAspect, sin(a) * r, 0.0, 1.0);
	gl_PointSize = 1.0;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

void main() {
	gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}