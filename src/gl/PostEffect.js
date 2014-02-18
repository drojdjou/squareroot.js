SQR.PostEffect = function(shaderPath) {
	var effectShader = engine.createShader();
    effectShader.load(shaderPath);

    var geo = new SQR.Geometry().quickSetup('v2t2');
    geo.data(SQR.Geometry.VERTEX,   [-1, 1,   1, 1,   1, -1,   -1, 1,   1, -1,   -1, -1]);
    geo.data(SQR.Geometry.TEXCOORD, [ 0, 1,   1, 1,   1,  0,    0, 1,   1,  0,    0,  0]);

    var root = new SQR.Transform();
    root.geometry = geo;
    root.renderer = engine.createRenderer(effectShader);
    
    root.setSource = function(source) {
    	root.renderer.u.uTexture = source.texture;
    }

    return root;
}