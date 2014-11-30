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
precision mediump float;

#ifndef ITE
#define ITE 16.0
#endif

uniform sampler2D uTexture;
uniform vec2 uDelta;

varying vec2 vUV;

const vec2 thickness = vec2(0.2, 0.2);

float brightness(vec3 c) {
    return c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722;
}

void main(void)
{
    vec4 sample[9];

    vec3 color = texture2D(uTexture, vUV).rgb;

    vec2 tc_offset[9];

    // vec2 a = vec2(0.2, 0.2);

    vec2 a = thickness;

    // http://www.neatware.com/lbstudio/web/hlsl.html
    tc_offset[0] = vec2(-0.0078125,  0.0078125) * a;
    tc_offset[1] = vec2( 0.0000000,  0.0078125) * a;
    tc_offset[2] = vec2( 0.0078125,  0.0078125) * a;
    tc_offset[3] = vec2(-0.0078125,  0.0000000) * a;
    tc_offset[4] = vec2( 0.0000000,  0.0000000) * a;
    tc_offset[5] = vec2( 0.0078125,  0.0070000) * a;
    tc_offset[6] = vec2(-0.0078125, -0.0078125) * a;
    tc_offset[7] = vec2( 0.0000000, -0.0078125) * a;
    tc_offset[8] = vec2( 0.0078125, -0.0078125) * a;

    for (int i = 0; i < 9; i++)
    {
        sample[i] = texture2D(uTexture, vUV + tc_offset[i]);
    }

    vec4 horizEdge = sample[2] + (2.0*sample[5]) + sample[8] -
                     (sample[0] + (2.0*sample[3]) + sample[6]);

    vec4 vertEdge = sample[0] + (2.0*sample[1]) + sample[2] -
                    (sample[6] + (2.0*sample[7]) + sample[8]);

    vec3 col = sqrt((horizEdge.rgb * horizEdge.rgb) + (vertEdge.rgb * vertEdge.rgb));

    vec3 e = vec3(step(0.3, brightness(col)));

    vec3 stepColor = (color * 4.0);
    stepColor = stepColor - fract(stepColor);
    stepColor = stepColor * 0.25;

    gl_FragColor.rgb = (1.0 - e) * stepColor;

    gl_FragColor.a = 1.0;
}




