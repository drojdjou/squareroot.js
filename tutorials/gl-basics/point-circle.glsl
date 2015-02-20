// normal2color.glsl
//#vertex
attribute float aAngle;
attribute float aRadius;
   
uniform float uAspect;

void main() {
	gl_Position = vec4(cos(aAngle) * aRadius * uAspect, sin(aAngle) * aRadius, 0.0, 1.0);
	gl_PointSize = 1.0;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

void main() {
	gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}