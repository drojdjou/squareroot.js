// shader.glsl
//#vertex
attribute vec2 aUV;
attribute vec2 aPosition;

uniform mat4 uConcatMatrix;

varying vec2 vUV;
     
void main() {
	vUV = aUV;
	gl_Position = uConcatMatrix * vec4(aPosition, 1.0, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif
               
uniform sampler2D uTexture;

varying vec2 vUV;
               
void main() {
	vec3 color = texture2D(uTexture, vUV).rgb;
	gl_FragColor = vec4(color, 1.0);
}