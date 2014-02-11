//#vertex
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uConcatMatrix;

varying vec2 vTexCoord;
     
void main() {
	vTexCoord = aTextureCoord;
	gl_Position = uConcatMatrix * vec4(aVertexPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uTexture;

varying vec2 vTexCoord;
                
void main() {
	vec4 tex = texture2D(uTexture, vTexCoord);
	gl_FragColor = tex;
}