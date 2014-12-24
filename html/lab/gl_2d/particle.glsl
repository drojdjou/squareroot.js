// shader.glsl
//#vertex
attribute vec3 aPosition;

uniform mat4 uViewMatrix;
uniform mat4 uMatrix;
uniform mat4 uProjection;
uniform float uSize;

void main() {
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
	gl_PointSize = uSize;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif
               
uniform sampler2D uTexture;
           
void main() {
	vec2 uv = gl_PointCoord.xy;
	uv.y = 1.0 - uv.y;
	gl_FragColor = texture2D(uTexture, uv);
}