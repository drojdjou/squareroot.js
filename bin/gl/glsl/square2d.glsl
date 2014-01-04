// 001-square.glsl
//#vertex
attribute vec3 aVertexColor;
attribute vec2 aVertexPosition;

varying vec3 vColor;
     
void main() {
	vColor = aVertexColor;
	gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif
               
uniform vec4 uColor;

varying vec3 vColor;
               
void main() {
	gl_FragColor = uColor * 0.5 + vec4(vColor, 1.0);
}