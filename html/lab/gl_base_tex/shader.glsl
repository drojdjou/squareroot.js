// shader.glsl
//#vertex
attribute vec2 aPosition;
attribute vec2 aUV;

uniform mat3 uMatrix;
uniform mat4 uProjection;

varying vec2 vUV;
     
void main() {
	vUV = aUV;
	gl_Position = uProjection * vec4(uMatrix * vec3(aPosition, 1.0), 1.0);
}
     
//#fragment
#ifdef GL_ES
precision highp float;
#endif
               
varying vec2 vUV;

uniform sampler2D uTexture;
               
void main() {
	vec3 color = texture2D(uTexture, vUV).rgb;

	float greyscale = (color.r + color.g + color.b) * 0.33;

	gl_FragColor = vec4(greyscale, greyscale, greyscale, 1.0);
}