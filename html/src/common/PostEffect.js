SQR.PostEffect = function(shaderSource) {
    SQR.fullScreenQuad = SQR.fullScreenQuad || SQR.Buffer()
        .layout(SQR.v2u2(), 6)
        .data('aPosition', -1, 1,   1, 1,   1, -1,   -1, 1,   1, -1,   -1, -1)
        .data('aUV',        0, 1,   1, 1,   1,  0,    0, 1,   1,  0,    0,  0)
        .update();

    var pe = new SQR.Transform();
    pe.buffer = SQR.fullScreenQuad;
    pe.shader = SQR.Shader(shaderSource);

    return pe;
}