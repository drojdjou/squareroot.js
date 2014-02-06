//#vertex
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uConcatMatrix;
uniform mat3 uNormalMatrix;

varying vec2 vTexCoord;
     
void main() {
	vTexCoord = aTextureCoord;
	gl_Position = uConcatMatrix * vec4(aVertexPosition, 1.0);
	gl_PointSize = 3.0;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTexCoord;
               
void main() {
	gl_FragColor = vec4(vTexCoord.x, 0.0, 0.0, 1.0);
}