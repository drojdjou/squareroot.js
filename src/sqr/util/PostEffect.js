SQR.PostEffect = function(shaderPath) {
	var effectShader = engine.createShader();
    effectShader.load(shaderPath);

    var root = new SQR.Transform();
    root.geometry = new SQR.Quad.fullscreen();
    root.renderer = engine.createRenderer(effectShader);
    
    root.setSource = function(source) {
    	root.renderer.u.uTexture = source.texture;
    }

    return root;
}