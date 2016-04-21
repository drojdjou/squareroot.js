//#name texture

/*#docs

@description <p>A simple textured shader</p> 

<p>The shader accepts a single texture and UV channel to map it to.</p>

*/

attribute vec3 aPosition;
attribute vec2 aUV;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

varying vec2 vUV;
     
void main() {
	vUV = aUV;
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
precision mediump float;
               
uniform sampler2D uTexture;
varying vec2 vUV;
           
void main() {
	gl_FragColor = texture2D(uTexture, vUV);
}