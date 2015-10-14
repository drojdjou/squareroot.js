// normal2color.glsl
//#vertex
attribute vec3 aPosition;
attribute float aSize;
attribute float aBrightness;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;
 
void main() {
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
precision mediump float;

uniform vec3 uColor;
                 
void main() {
	gl_FragColor = vec4(uColor, 1.0);
}