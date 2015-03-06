// image.glsl
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
               
void main() {
	vec3 image = texture2D(uTexture, vUV).rgb;
	gl_FragColor = vec4(image, 1.0);
}