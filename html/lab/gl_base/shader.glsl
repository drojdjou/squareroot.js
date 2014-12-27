// shader.glsl
//#vertex
attribute vec3 aColor;
attribute vec2 aPosition;

uniform mat4 uConcatMatrix;

varying vec3 vColor;
     
void main() {
	vColor = aColor;
	gl_Position = uConcatMatrix * vec4(aPosition, 1.0, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif
               
uniform vec4 uColor;

varying vec3 vColor;
               
void main() {
	gl_FragColor = uColor * 0.5 + vec4(vColor, 1.0);
}