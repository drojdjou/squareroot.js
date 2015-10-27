<!DOCTYPE html>
<html>
<head>
	<title>SQR | squareroot.js</title>

	<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, minimal-ui">
	<meta name="robots" content="noindex, nofollow">
	<meta charset="UTF-8">

	<script src="https://use.typekit.net/xte5chr.js"></script>
	<script>try{Typekit.load({ async: true });}catch(e){}</script>

	<link rel="stylesheet" type="text/css" href="home/css/master.css">
	
</head>

<body>


<section class='splash'>
	<iframe src='html/lab/gl_splash/'></iframe>
</section>

<section class='content'>

	<article>
		<h1>Squareroot.js</h1>

		<p>Squareroot is a pretty thin layer over the WebGL API. The code originates from experiences on different WebGL projects and is written in a very pregmatic way.</p>

		<p>A lot of the structure is inspired by the Unity3d API, including the central concept of 'transforms' as building blocks. It also has a Unity to JSON/WebGL exporter.</p>

		<p>It is developped and maitained by <a href='http://holotype.co'>Holotype</a> and used in many of their <a href='http://holotype.co/work'>WebGL projects</a>.</p>
	</acticle>

	<article>
		<ul  class='links'>
			<li><a href='https://github.com/drojdjou/squareroot.js/'><img src='home/assets/github.svg'><br>Github Repository</a></li>
			<li><a href='docs/'><img src='home/assets/docs.svg'><br>API docs and tutorials</a></li>
		</ul>
	</acticle>

	<article>
		<h1>Basic Examples</h1>

		<ul class='grid'>
			<li><a href='tutorials/basic-setup.html' target='_blank'><img src='home/thumbs/examples/cube.jpg'>Rotating cube</a></li>
			<li><a href='tutorials/understanding-buffers.html' target='_blank'><img src='home/thumbs/examples/buffer.jpg'>Custom geometry</a></li>
			<li><a href='tutorials/post-effect.html' target='_blank'><img src='home/thumbs/examples/post.jpg'>Post effect</a></li>
			<li><a href='tutorials/mesh.html' target='_blank'><img src='home/thumbs/examples/mesh.jpg'>Loading a mesh</a></li>
		</ul>

		<h1>Demos</h1>

		<ul class='grid'>
			<li><a href='html/lab/gl_tree/03-forest-vr.html' target='_blank'><img src='home/thumbs/demos/vr.jpg'>WebVR (Ocullus, Cardboard VR)</a></li>
			<li><a href='html/lab/gl_carpet/' target='_blank'><img src='home/thumbs/demos/carpet.jpg'>Perlin Noise Animation</a></li>
			<li><a href='html/lab/gl_cubemap/' target='_blank'><img src='home/thumbs/demos/cuberefl.jpg'>Real-time reflections</a></li>
			<li><a href='html/lab/gl_dof/' target='_blank'><img src='home/thumbs/demos/dof.jpg'>Depth-of-field effect</a></li>
			<li><a href='html/lab/gl_lines/' target='_blank'><img src='home/thumbs/demos/fish.jpg'>Animation aling splines</a></li>
			<li><a href='html/lab/gl_tree/02-forest-batch.html' target='_blank'><img src='home/thumbs/demos/forest.jpg'>Dynamic geometry</a></li>
			<li><a href='html/lab/gl_dust/' target='_blank'><img src='home/thumbs/demos/nodegarden.jpg'>2D animation</a></li>
			<li><a href='html/lab/gl_bones/hand.html' target='_blank'><img src='home/thumbs/demos/hand.jpg'>Skinned mesh</a></li>
			<li><a href='html/lab/webcam_reflection' target='_blank'><img src='home/thumbs/demos/webcam-refl.jpg'>Live webcam reflection</a></li>
		</ul>
	</acticle>

</section>

<script>
if(location.host.indexOf('local') > -1 || location.host.indexOf('192.168') > -1) {
	document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>');
}
</script>

</body>
</html>

