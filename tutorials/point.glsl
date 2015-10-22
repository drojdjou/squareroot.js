//#name point.glsl
//#vertex
attribute vec3 aPosition;

uniform mat4 uViewMatrix;
uniform mat4 uProjection;
   
void main() {
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
	gl_PointSize = 2.0;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform vec3 uColor;
      
void main() {
	gl_FragColor = vec4(uColor, 1.0);
}