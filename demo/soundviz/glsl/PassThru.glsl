//#vertex
precision mediump float;
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

varying vec2 vTextureCoord;

void main(void) {
    gl_Position = vec4(aVertexPosition, 0.0, 1.0);
    vTextureCoord = aTextureCoord;  
}

//#fragment
precision mediump float;
uniform sampler2D uTexture;
varying vec2 vTextureCoord;

void main(void) {
    vec3 c = texture2D(uTexture, vTextureCoord).rgb;
    gl_FragColor = vec4(c, 1.0);
}