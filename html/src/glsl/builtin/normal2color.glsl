//#name normal2color

/*#docs

@description <p>A simple debug shader</p> 

<p>The direction of the normal is translated into the color for each pixel. Simple and useful for debugging.</p>

*/

// In SQR shaders are written in separate GLSL files such as <a href='glsl/normal2color.glsl' target='_blank'>this one</a>
// which containt both the vertex and the fragment shader.
// They are delimited by special meta comments: 
//#vertex indicates that this is where the vertex shader starts
//#fragment indicates that this is where the fragment shader starts

// For an in-depth tutorial on shaders <a href='../docs/tutorial-understanding-shaders.html' target='_blank'>please look here</a>.

//#vertex

// The attributes reflect the attributes defined in the buffer.
// The aNormal and aPosition attributes are created by built-in function
// that creates the cube shaped geometry (see JS code above)
attribute vec3 aPosition;
attribute vec3 aNormal;

// SQR populates each shader with a bunch of common uniforms:

// The object-world matrix for this object
uniform mat4 uMatrix;
// The object-view space matrix
uniform mat4 uViewMatrix;
// The projection matrix
uniform mat4 uProjection;
// The normal matrix, used to transform normals
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
     
void main() {
	vNormal = normalize(uNormalMatrix * aNormal);
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
precision mediump float;
               
varying vec3 vNormal;
           
void main() {
	gl_FragColor = vec4(vec3(0.5) + vNormal * 0.5, 1.0);
}