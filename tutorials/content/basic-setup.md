### Basic scene setup

See the below code in action [here](../tutorials/basic-setup.php).

To start, load all the files you need using. Each file will be available  from the asset object pasesd into the `onAssets` callback under it's name, ex. `assets['normal2color.glsl']`. 

It's possible ot specify an alias: instead of a String, use an Array, where [0]is the path, and [1] is the alias:

```
SQR.Loader.loadAssets([
    ['normal2color.glsl', 'n2c'],
], onAssets);
```
When the assets are loaded, the `onAssets` function will be invoked:
```
var onAssets = function(assets) {
```
Create the renderer based on the #id of the canvas element.
``` 
var renderer = SQR.Renderer('#gl-canvas');
```
There is no 'scene' object in SQR. The renderer takes any transform and renderes this transform and all it's childrend. It makes it very flexible as you can ex render a part of the scene any time. Let's create a root transform that will hold our entire scene:
``` 
var root = SQR.Transform(); 
```
In the same way as there is no special object for 'scene' there isn't one for a 'camera'. The camera is just another transform. Just make sure that it's added to the root (or any of it's children)if you want to move the camera around (otherwise the scene will render always as if the camera was 0,0,0)
```
var camera = SQR.Transform();
camera.position.z = 5;
root.add(camera);
```
Now let's move on and handle the viewport size and a projection matrix. Those to things are linked together and both are modified inside the resize handler. At the end we register the listener and call it once for start.
```
var resize =function() {
    var w = window.innerWidth, h = window.innerHeight, aspect = w/h;
    ctx.size(w, h);
    camera.projection = new SQR.ProjectionMatrix().perspective(70, aspect, 1, 1000);
}

window.addEventListener('resize', resize);
resize();
```
Now the fun begins. Let's add an object.
```
var cube = SQR.Transform();
cube.buffer = SQR.Primitives.createCube(2, 2, 2)
cube.shader = SQR.Shader(assets.n2c);
root.add(cube);
```
A lot happens here, so let's go line-by-line:
- first create an empty transform A SQR.Transform is just a point in space - it has position, rotation and scale but no shape. To render a shape you need to attach a buffer and a shader to the transform
- the buffer is a cube created using the `createCube` function available from the Primitives object.
- the shader is created simply by passing the shader GLSL code (loaded in with the `Loader` above) to the SQR.Shader constructor function.
- finally we add the transform to the root transform so that it gets rendered

And now we are ready to start rendering.
```
var render = function() {
    requestAnimationFrame(render);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.02;
    renderer.render(root, camera);
}
render();
```
We render the scene from the root transform up, directly to screen using the `camera` as point of view. The cube is also rotated a bit on every frame which create a simple animation.

Finally, do not forget to close the function bracket!
```
};
```

