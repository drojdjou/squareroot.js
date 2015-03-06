// shader.glsl
//#vertex
attribute vec2 aPosition;
attribute vec2 aUV;

varying vec2 vUV;
     
void main() {
	vUV = aUV;
	gl_Position = vec4(aPosition, 0.0, 1.0);
}
     
//#fragment
#ifdef GL_ES
precision highp float;
#endif
               
varying vec2 vUV;
uniform sampler2D uTexture;
uniform sampler2D uBlurTexture;
uniform sampler2D uMaskTexture;
               
void main() {
	vec3 image = texture2D(uTexture, vUV).rgb;
	vec3 blur =  texture2D(uBlurTexture, vUV).rgb;
	float mask = texture2D(uMaskTexture, vUV).r;

	vec3 final = mix(blur, image, mask);

	gl_FragColor = vec4(final, 1.0);
}