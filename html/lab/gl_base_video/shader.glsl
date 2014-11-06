// shader.glsl
//#vertex
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

varying vec2 vTexCoord;
     
void main() {
	vTexCoord = aTextureCoord;
	gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif
               
varying vec2 vTexCoord;

uniform sampler2D uTexture;
uniform float uSaturation;
               
void main() {
	vec3 color = texture2D(uTexture, vTexCoord).rgb;

	vec3 greyscale = vec3((color.r + color.g + color.b) * 0.33);

	vec3 finalColor = mix(greyscale, color, uSaturation);

	gl_FragColor = vec4(finalColor, 1.0);
}