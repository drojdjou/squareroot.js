// shader.glsl
//#vertex
attribute vec3 aNormal;
attribute vec3 aPosition;
attribute vec2 aUV;

uniform mat4 uMatrix;
uniform mat3 uNormalMatrix;
uniform mat4 uProjection;

varying vec3 vNormal;
varying vec2 vUV;
     
void main() {
    vUV = aUV;
	vNormal = uNormalMatrix * aNormal;
	gl_Position = uProjection * uMatrix * vec4(aPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision mediump float;
#endif

// #include ~light/diffuse.glsl
//#include ~light/sphar-eucalyptus.glsl
//#include ~light/sphar.glsl

               
varying vec3 vNormal;
varying vec2 vUV;

uniform sampler2D uTexture;
           
void main() {
    vec4 col = texture2D(uTexture, vUV);
	gl_FragColor = vec4(sphericalHarmonics(vNormal) * 1.0 + col.rgb * 0.0, 1.0);
}








