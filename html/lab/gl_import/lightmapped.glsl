//# lightmapped
//#vertex
attribute vec3 aNormal;
attribute vec3 aPosition;
attribute vec2 aUV;
attribute vec2 aUV2;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
varying vec2 vUV;
varying vec2 vUV2;
     
void main() {
	vUV = aUV;
	vUV2 = aUV2;
	vNormal = normalize(uNormalMatrix * aNormal);
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
precision mediump float;
         
varying vec3 vNormal;
varying vec2 vUV;
varying vec2 vUV2;

uniform vec3 uLight;
uniform vec3 uColor;
uniform sampler2D uLightmap;
uniform vec4 uLightmapTileOffset;
           
void main() {

	vec2 luv = vUV2;
	luv *= uLightmapTileOffset.xy;
	luv += uLightmapTileOffset.zw;

	vec4 lm = texture2D(uLightmap, luv);
	gl_FragColor = vec4(uColor * lm.rgb, 1.0);
}