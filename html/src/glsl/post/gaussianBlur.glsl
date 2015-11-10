//#name gaussianBlur

//#vertex
attribute vec2 aPosition;
attribute vec2 aUV;

varying vec2 vBlurTexCoord[14];
varying vec2 vUV;
 
void main()
{
	vUV = aUV;

#ifdef VERTICAL_BLUR
	vBlurTexCoord[ 0] = aUV + vec2(-0.028, 0.0);
	vBlurTexCoord[ 1] = aUV + vec2(-0.024, 0.0);
	vBlurTexCoord[ 2] = aUV + vec2(-0.020, 0.0);
	vBlurTexCoord[ 3] = aUV + vec2(-0.016, 0.0);
	vBlurTexCoord[ 4] = aUV + vec2(-0.012, 0.0);
	vBlurTexCoord[ 5] = aUV + vec2(-0.008, 0.0);
	vBlurTexCoord[ 6] = aUV + vec2(-0.004, 0.0);
	vBlurTexCoord[ 7] = aUV + vec2( 0.004, 0.0);
	vBlurTexCoord[ 8] = aUV + vec2( 0.008, 0.0);
	vBlurTexCoord[ 9] = aUV + vec2( 0.012, 0.0);
	vBlurTexCoord[10] = aUV + vec2( 0.016, 0.0);
	vBlurTexCoord[11] = aUV + vec2( 0.020, 0.0);
	vBlurTexCoord[12] = aUV + vec2( 0.024, 0.0);
	vBlurTexCoord[13] = aUV + vec2( 0.028, 0.0);
#else
	vBlurTexCoord[ 0] = aUV + vec2(0.0, -0.028);
	vBlurTexCoord[ 1] = aUV + vec2(0.0, -0.024);
	vBlurTexCoord[ 2] = aUV + vec2(0.0, -0.020);
	vBlurTexCoord[ 3] = aUV + vec2(0.0, -0.016);
	vBlurTexCoord[ 4] = aUV + vec2(0.0, -0.012);
	vBlurTexCoord[ 5] = aUV + vec2(0.0, -0.008);
	vBlurTexCoord[ 6] = aUV + vec2(0.0, -0.004);
	vBlurTexCoord[ 7] = aUV + vec2(0.0,  0.004);
	vBlurTexCoord[ 8] = aUV + vec2(0.0,  0.008);
	vBlurTexCoord[ 9] = aUV + vec2(0.0,  0.012);
	vBlurTexCoord[10] = aUV + vec2(0.0,  0.016);
	vBlurTexCoord[11] = aUV + vec2(0.0,  0.020);
	vBlurTexCoord[12] = aUV + vec2(0.0,  0.024);
	vBlurTexCoord[13] = aUV + vec2(0.0,  0.028);
#endif

	gl_Position = vec4(aPosition, 0.0, 1.0);
}

//#fragment
precision mediump float;
 
uniform sampler2D uTexture;

varying vec2 vBlurTexCoord[14];
varying vec2 vUV;
 
void main()
{
	gl_FragColor = vec4(0.0);
	gl_FragColor += texture2D(uTexture, vBlurTexCoord[ 0])*0.0044299121055113265;
	gl_FragColor += texture2D(uTexture, vBlurTexCoord[ 1])*0.00895781211794;
	gl_FragColor += texture2D(uTexture, vBlurTexCoord[ 2])*0.0215963866053;
	gl_FragColor += texture2D(uTexture, vBlurTexCoord[ 3])*0.0443683338718;
	gl_FragColor += texture2D(uTexture, vBlurTexCoord[ 4])*0.0776744219933;
	gl_FragColor += texture2D(uTexture, vBlurTexCoord[ 5])*0.115876621105;
	gl_FragColor += texture2D(uTexture, vBlurTexCoord[ 6])*0.147308056121;
	gl_FragColor += texture2D(uTexture, vUV    			 )*0.159576912161;
	gl_FragColor += texture2D(uTexture, vBlurTexCoord[ 7])*0.147308056121;
	gl_FragColor += texture2D(uTexture, vBlurTexCoord[ 8])*0.115876621105;
	gl_FragColor += texture2D(uTexture, vBlurTexCoord[ 9])*0.0776744219933;
	gl_FragColor += texture2D(uTexture, vBlurTexCoord[10])*0.0443683338718;
	gl_FragColor += texture2D(uTexture, vBlurTexCoord[11])*0.0215963866053;
	gl_FragColor += texture2D(uTexture, vBlurTexCoord[12])*0.00895781211794;
	gl_FragColor += texture2D(uTexture, vBlurTexCoord[13])*0.0044299121055113265;
}