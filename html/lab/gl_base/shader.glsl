// shader.glsl
//#vertex
attribute vec3 aColor;
attribute vec2 aPosition;

uniform mat3 uMatrix;
uniform mat4 uConcatMatrix;
uniform mat4 uProjection;

varying vec3 vColor;
     
void main() {
	vColor = aColor;
	// gl_Position = uProjection * vec4(uMatrix * vec3(aPosition, 1.0), 1.0);
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