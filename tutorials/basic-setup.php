<!DOCTYPE html>
<html>
<head>
<title>Simple 3d rotating cube</title>

<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">

<script type="text/javascript" src="../build/sqr.js"></script>
<script type="text/javascript" src="../build/sqr-primitives.js"></script>


<script type="text/javascript" src="../html/src/common/Context.js"></script>
<script type="text/javascript" src="../html/src/common/Renderer.js"></script>
<script type="text/javascript" src="../html/src/math/ProjectionMatrix.js"></script>

<link rel="icon" href="../home/assets/favicon.png" type="image/x-icon">
<link rel="shortcut icon" href="../home/assets/favicon.png" type="image/x-icon">

<link rel="stylesheet" type="text/css" href="../html/lab/base.css">

</head>
<body>

<!-- This shader code is only included for documentation (i.e. the "view source" function), 
	 it is not necessary otherwise since it is loaded using SQR.Loader below -->
<script type="x-shader" class="gl-shader">

<?php include('glsl/normal2color.glsl') ?>

</script>

<script type="text/javascript" id="gl-script">

// Global loader for all the assets
SQR.Loader.loadAssets([

	// Declare each file to load with a path and an alias
	// The contents of this file will be available in the
	// assets object in the callback below, by alias name
	// ex. assets.n2c in this case
	['glsl/normal2color.glsl', 'n2c']

], function(assets) {

	// Create a renderer 
	var renderer = SQR.Renderer();

	// Attach the canvas element to the document body
	document.body.appendChild(renderer.context.canvas);

	// Create a resize handler and call it once to set the size of the viewport 
	// and the a projection matrix
	var resize = function() {
		var w = window.innerWidth, h = window.innerHeight, aspect = w/h;
		renderer.context.size(w, h);
		// The projection matrix can bve defined globally as a property of the renderer
		// or per camera (if your scene uses multiple cameras).
		// For now, we will stick to the simplest scenario.
		renderer.projection = new SQR.ProjectionMatrix().perspective(60, aspect);
	}
	window.addEventListener('resize', resize);
	resize();

	// In SQR, the scene you render is a hierarchy of SQR.Transform objects.
	// To start, you create a transform that is the mother of all
	// the other transforms in the scene. We like to call it 'root'.
	// A transform is an invisible point in space, like an Null Object in Maya or Empty in C4D.
	var root = SQR.Transform();

	// Next, create a camera.
	// Note that a camera in SQR is just another SQR.Transform, not a special object type.
	// It's only purpose is to define the point of view of the rendering.
	// To change the point of view simply move or rotate the camera,
	// for now we will leave it at its default position of 0, 0, 0
	var camera = SQR.Transform();

	// To create a 3d object, we start with another transform.
	var cube = SQR.Transform();

	// We move this one a bit on the z-axis so that shows up in front of the camera.
	cube.position.z = -5;

	// Since a transform is only a point in space,
	// to see a shape in 3d we need to decorate the transform
	// with two object - a buffer and a shader.

	// A buffer defines the objects geometry (i.e. its shape)
	// SQR offers a bunch functions to create simple shapes out of the box
	// such as createCube(width, height, depth) below.
	cube.buffer = SQR.Primitives.createCube(2, 2, 2);

	// A shader defined the objects color 
	// (and is often called material in other 3d software). 
	// SQR does not have any built-in materials. 
	// Instead shaders are created in GLSL code loaded from an external GLSL file 
	// loaded with SQR.Loader above in this case.
	// To create a shader just pass the content of that file to the SQR.Shader constructor function.
	cube.shader = SQR.Shader(assets.n2c);

	// Now we can add our objects to the root transform
	root.add(cube, camera);

	// Ok, we're all setup, let the rendering begin!
	var render = function() {

		requestAnimationFrame(render);

		// Rotate the cube a bit on each frame
		cube.rotation.x += 0.005;
		cube.rotation.y += 0.01;

		// The render function will render all the transforms that are
		// added to root and it's ancestors. It takes two arguments:
		// - the root transform itself
		// - camera transform, so that it knows what point of view to render from
		renderer.render(root, camera);
	}

	render();
});
</script>

<header>
	<button class="icon"></button>
	<article>
		<code></code>
	</article>
</header>
<script type="text/javascript" src="../html/lab/base.js"></script>

<script>
if(location.host.indexOf('localhost') > -1 || location.host.indexOf('192.168') > -1) {
	document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>');
}
</script>

</body>
</head>



