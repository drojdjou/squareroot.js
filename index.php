<!DOCTYPE html>
<html>
<head>
<title>SQR | squareroot.js</title>

<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, minimal-ui">
<meta charset="UTF-8">

<meta name='keywords' content='interactive,design,webgl,fwa,awwwards'/>
<meta name='description' content='We are Holotype - an interactive studio. We help our clients come up with the best digital ideas and turn those ideas into captivating interactive experiences.'/>

<meta property='og:title' content='Squareroot.js - Javascript creative coding library'/>
<meta property="og:site_name" content="sqr.holotype.co"/>
<meta property="og:url" content="http://sqr.holotype.co"/>
<meta property="og:description" content="Squareroot.js is a flexible and easy to use Javascript creative coding library based on the WebGL API. It is developed and maintained by Holotype."/>
<meta property="og:image" content="http://sqr.holotype.co/home/assets/share/sqr.jpg" />

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:creator" content="@bartekd">
<meta name="twitter:url" content="http://sqr.holotype.co">
<meta name="twitter:title" content="Squareroot.js - Javascript creative coding library">
<meta name="twitter:description" content="Squareroot.js is a flexible and easy to use Javascript creative coding library based on the WebGL API. It is developed and maintained by Holotype.">
<meta name="twitter:image" content="http://sqr.holotype.co/home/assets/share/sqr.jpg">

<link rel="icon" href="home/assets/favicon.png" type="image/x-icon">
<link rel="shortcut icon" href="home/assets/favicon.png" type="image/x-icon">

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

		<p>Squareroot.js is a Javascript creative coding library based on the WebGL API. It is developed and maintained by <a href='http://holotype.co'>Holotype</a> and used in many of our <a href='http://holotype.co/work'>projects</a>.</p>

		<p>Squareroot.js code was born out of many years of experience in building WebGL apps. It is written in a pragmatic way - with the goal of getting things done rather than complying to a praticular programming pattern or philosphy. It makes it very flexible, powerful and easy to use, once you get familiar with it.</a>

		<p>The first version of this library was created 6 years ago - it was called <a href='https://github.com/drojdjou/J3D/'>J3D</a> back then. After that is was re-written from scratch... three times. Each iteration was was built with better understanding of the underlying WebGL API and the mathematics of 2d and 3d rendering.</p>

		<p>The structure is loosely based on Unity3d API, including the central concept of 'Transforms' as building blocks. It also features a Unity-to-WebGL exporter that can export meshes and skinned meshes, textures, animations and even entire scenes.</p>

	</article>

	<article>
		<ul  class='links'>
			<li><a href='https://github.com/drojdjou/squareroot.js/'><img src='home/assets/github.svg'><br>Github Repository</a></li>
			<li><a href='docs/'><img src='home/assets/docs.svg'><br>API docs and tutorials</a></li>
		</ul>
	</article>

	<article>
		<h1>Basic Examples</h1>

		<ul class='grid'>
			<li><a href='tutorials/basic-setup.php' target='_blank'><img src='home/thumbs/examples/cube.jpg'>Hello World!</a></li>
			<li><a href='tutorials/understanding-buffers.html' target='_blank'><img src='home/thumbs/examples/buffer.jpg'>Custom geometry</a></li>
			<li><a href='tutorials/post-effect.html' target='_blank'><img src='home/thumbs/examples/post.jpg'>Post effect</a></li>
			<li><a href='tutorials/mesh.html' target='_blank'><img src='home/thumbs/examples/mesh.jpg'>Loading a mesh</a></li>
		</ul>
	</article>

	<article>
		<h1>Demos</h1>

		<ul class='grid'>
			<li><a href='html/lab/gl_tree/03-forest-vr.html' target='_blank'><img src='home/thumbs/demos/vr.jpg'>WebVR (Rift/Cardboard)</a></li>
			<li><a href='html/lab/gl_carpet/' target='_blank'><img src='home/thumbs/demos/carpet.jpg'>Perlin Noise Animation</a></li>
			<li><a href='html/lab/gl_cubemap/' target='_blank'><img src='home/thumbs/demos/cuberefl.jpg'>Real-time reflections</a></li>
			<li><a href='html/lab/gl_dof/' target='_blank'><img src='home/thumbs/demos/dof.jpg'>Depth-of-field effect</a></li>
			<li><a href='html/lab/gl_lines/' target='_blank'><img src='home/thumbs/demos/fish.jpg'>Animation aling splines</a></li>
			<li><a href='html/lab/gl_tree/02-forest-batch.html' target='_blank'><img src='home/thumbs/demos/forest.jpg'>Dynamic geometry</a></li>
			<li><a href='html/lab/gl_dust/' target='_blank'><img src='home/thumbs/demos/nodegarden.jpg'>2D animation</a></li>
			<li><a href='html/lab/gl_bones/hand.html' target='_blank'><img src='home/thumbs/demos/hand.jpg'>Skinned mesh</a></li>
			<li><a href='html/lab/webcam_reflection' target='_blank'><img src='home/thumbs/demos/webcam-refl.jpg'>Live webcam reflection</a></li>
		</ul>
	</article>

	<footer>
		Created by <a href='http://holotype.co'>HOLOTYPE</a>
	</footer>

</section>

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-68827452-2', 'auto');
  ga('send', 'pageview');

</script>

<script>
if(location.host.indexOf('local') > -1 || location.host.indexOf('192.168') > -1) {
	document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35934/livereload.js?snipver=1"></' + 'script>');
}
</script>

</body>
</html>

