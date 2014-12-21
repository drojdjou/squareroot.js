// webcam post
//#vertex
precision mediump float;

attribute vec2 aPosition;
attribute vec2 aUV;

varying vec2 vUV;

void main(void) {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    vUV = aUV;  
}

//#fragment
precision highp float;

uniform sampler2D uTexture;

varying vec2 vUV;

void main() 
{
	vec4 col = texture2D(uTexture, vUV);
	gl_FragColor = vec4(col.rgb, 1.0);
}
