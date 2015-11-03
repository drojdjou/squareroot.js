// normal2color.glsl
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
varying float vX;
	 
void main() {
	vNormal = normalize(uNormalMatrix * aNormal);
	vUV = aUV;
	vX = aPosition.x;
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
precision highp float;

varying vec3 vNormal;          
varying vec2 vUV;
varying float vX;

uniform sampler2D uTexture;
uniform vec3 uLight;
uniform vec2 uTextureTile;
uniform vec2 uTextureOffset;

//#include fog

void main() {
	float l = 0.4 + 1.2 * max(-0.3, dot(vNormal, uLight));

	vec2 uv = vUV * uTextureTile + uTextureOffset;
	vec3 c = texture2D(uTexture, uv).rgb;
	
	gl_FragColor = vec4(fog(c * l), 1.0);
}