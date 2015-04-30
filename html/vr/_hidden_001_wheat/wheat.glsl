// shader.glsl
//#vertex
attribute vec3 aPosition;
attribute vec2 aUV;

uniform mat4 uViewMatrix;
uniform mat3 uNormalMatrix;
uniform mat4 uProjection;
uniform float uTime;
uniform float uSpeed;
uniform float uForce;
uniform float uTimeOffset;

varying vec2 vUV;
     
void main() {
    vUV = aUV;
    vec3 p = aPosition;
    p.x += sin(uTimeOffset + uTime * uSpeed) * p.y * uForce;
	gl_Position = uProjection * uViewMatrix * vec4(p, 1.0);
}

//#fragment
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uTexture;
uniform float uTint;
               
varying vec2 vUV;

void main() {
    vec4 c = texture2D(uTexture, vUV);
    c.rgb = c.rgb * (0.6 + 0.6 * uTint);
    gl_FragColor = vec4(c.rgb, c.a * c.a);
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}








