// wire-dot.glsl
//#vertex
attribute vec3 aPosition;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

uniform float uDotSize;

varying float dp;

void main() {
	dp = 1.0 * ((uMatrix * vec4(aPosition, 1.0)).z + 1.0);
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
	gl_PointSize = uDotSize;
}

//#fragment
precision highp float;
               
uniform vec3 uColor;
uniform sampler2D uDotTexture;

varying float dp;
           
void main() {
	float dt = texture2D(uDotTexture, gl_PointCoord).r;
	gl_FragColor = vec4(uColor * 1.2, dt * dp);
}