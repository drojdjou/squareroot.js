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
	gl_PointSize = 8.0;
}

//#fragment
precision highp float;

varying vec3 vNormal;          
varying vec2 vUV;
varying float vX;

uniform sampler2D uTexture;
uniform sampler2D uBlurTexture;
uniform vec3 uLight;
uniform vec2 uTextureTile;
uniform vec2 uTextureOffset;

uniform vec3 uColor;
uniform vec3 uColorDark;
uniform vec2 uAmbient;

uniform float uTime;

//#include fog

void main() {
	float l = uAmbient.x + uAmbient.y * max(0.0, dot(vNormal, uLight));

	vec2 uv = vUV * uTextureTile + uTextureOffset;

	vec2 buv = vUV;
	buv.y -= uTime * 0.0001;

	vec3 c = texture2D(uTexture, uv).r * texture2D(uBlurTexture, buv).rgb * l;
	
	gl_FragColor = vec4(fog(c), 1.0);
}