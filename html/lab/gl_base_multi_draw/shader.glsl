// shader.glsl
//#vertex
attribute vec3 aVertexColor;
attribute vec2 aVertexPosition;

varying vec3 vColor;

uniform vec3 uTranslate;
     
void main() {
	vColor = aVertexColor;
	vec2 p = aVertexPosition + uTranslate.xy;
	gl_Position = vec4(p, 0.0, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif
               
varying vec3 vColor;
               
void main() {
	gl_FragColor = vec4(vColor, 1.0);
}