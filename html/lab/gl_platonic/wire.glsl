// wire-dot.glsl
//#vertex
attribute vec3 aPosition;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

varying float dp;

void main() {
	dp = 0.2 + 0.8 * ((uMatrix * vec4(aPosition, 1.0)).z + 1.0);
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
precision highp float;
               
uniform vec3 uColor;
uniform float uAlpha;

varying float dp;
           
void main() {
	gl_FragColor = vec4(uColor * dp, uAlpha);
}