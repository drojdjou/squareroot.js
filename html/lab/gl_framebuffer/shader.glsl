// shader.glsl
//#vertex
attribute vec3 aNormal;
attribute vec3 aPosition;
attribute vec2 aUV;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
varying vec2 vUV;
     
void main() {
	vUV = aUV;
	vNormal = aNormal;
	gl_Position = uProjection * uMatrix * vec4(aPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif
               
varying vec3 vNormal;
uniform sampler2D uTexture;
uniform sampler2D uImage;
varying vec2 vUV;
           
void main() {
	vec3 color = texture2D(uTexture, vUV).rgb;
	vec3 image = texture2D(uImage, vUV).rgb;
	gl_FragColor = vec4(max(color, image), 1.0);
}