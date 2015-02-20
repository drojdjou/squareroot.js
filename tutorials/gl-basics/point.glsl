// normal2color.glsl
//#vertex
attribute vec2 aPosition;
   
void main() {
	gl_Position = vec4(aPosition, 0.0, 1.0);
	gl_PointSize = 10.0;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform vec3 uColor;

void main() {
	gl_FragColor = vec4(uColor, 1.0);
}