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
               
void main() {
	vec3 image = texture2D(uTexture, vUV).rgb;
	vec3 blur = texture2D(uBlurTexture, vUV).rgb;

	float dist = length(vec2(0.5, 0.5) - vUV) * 2.0;
	dist = dist * dist;
	vec3 final = mix(image, blur, smoothstep(0.0, 0.66, vUV.y));

	final *= 0.75 + 0.25 * (1.0 - dist);

	gl_FragColor = vec4(final, 1.0);
}