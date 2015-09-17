// normal2color.glsl
//#vertex
attribute vec3 aPosition;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
     
void main() {
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
precision highp float;
               
uniform vec3 uColor;

uniform float uFogStart;
uniform float uFogEnd;
uniform vec3 uFogColor;
           
void main() {
	float w = (gl_FragCoord.z / gl_FragCoord.w - uFogStart) / (uFogEnd - uFogStart);
	gl_FragColor = vec4(mix(uColor, uFogColor, w * w), 1.0);
}