### 2d rendering on canvas

SQR has a simple 2d rendering engine located in the solder `src/two`. It festures functionality to render shapes and animations on the 2D Rendering Context of the `<canvas>` element, including support for rendering sprite-sheets.

The working demo for the tutorial below is available [here](../tutorials/canvas-rendering.html).

### Setup

The setup of the 2d rendering engine is very simple. Just create a canvas element:
```
<canvas></canvas>
```
In the code, first create the renderer:
```
var w = window.innerWidth, h = window.innerHeight;
var renderer = new SQR.CanvasRenderer('canvas');
renderer.setSize(w, h); 
```
This will grab the canvas element, create a context and get ready for rendering. Same as with 3d rendering, there is no scene, but the rendring is executed on a root object and all it's children. Let's create one and render the scene:
```
var root = SQR.Transform2d();

var run = function() {
    requestAnimationFrame(run);
    renderer.render(root);
}

run();
```
Nothing will get rendered yet, because the root object is empty and it has no children. Let's add a object.

### Transforms in 2D
Objects in the canvas renderer are called transforms and are instances of the {@link Transform2d} class.
```
var sun = SQR.Transform2d();
sun.position.set(w/2, h/2);
root.add(sun);
```
This will and an object to the middle of the stage. The {@link SQR.Transform2d} has a number of typical properties to manipulate the position, scale, rotation and transparency of an object, see the API docs for all the details.

A transform is just a point in space and it has no shape or color, so nothing will be rendered for now. What we need to do is it to define what the object looks like. 

In 3d the object shape and color is defined by it's geometry and a shader. In 2d this is much simpler. All it needs is a property called `shape` which is a function that takes the `context` (2d rendering context) as argument and uses it to draw a shape. 
```
sun.shape = function(ctx) {
    ctx.fillStyle = 'rgb(255, 228, 0)';
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, SQR.TWOPI);
    ctx.fill();
};
```
If the renderer finds the property `shape` on an object it fill assume it's a function and call it, passing the context as argument. The context is already translated, rotated and scaled to the position of the transform, so all is left is to define a path and draw it. In the above case you should see a yellow circle with a radius of 25px in the middle of the screen.

What is important to notice, is that this function will be called at each frame and the shape will be draw on the canvas from scratch each time. The shape is not pre-rendered or cached in any way. It is possible however to use and image instead, which is siginificanly faster if the shape is complex. Let's add an image now.

Since transforms can be nested, let's add a `earth` to the `sun`:
```
var earth = new SQR.Transform2d();
earth.scale.set(0.4, 0.4);
earth.position.set(200, 0);
earth.shape = (function() {
    var i = new Image();
    i.src = 'assets/earth-128.png';
    return function(ctx) {
        var w = i.width, h = i.height;
        ctx.drawImage(i, w/-2, h/-2, w, h);
    }
})();
sun.add(earth);
```
We move and scale the earth transform. We also setup the drawing in a different way. Instead of using the canvas drawing functions we use an image that is copied onto the canvas at each frame.

Another option is to draw the shape to an offscreen canvas and use this canvas as source for the transforms shape. This is the approach used by sprite-sheets.

### Sprite-sheet animation
The idea of a sprite-sheet is to pre-render a series of images that will be copied to the main canvas. A working demo for the sprite-sheet example is available [here](../tutorials/sprite-sheet.html).

The setup of a sprite-sheet consists of three steps. First - create an instance of a sprite-sheet. The declare the size of a cell as well as how many rows and columns it has using the `layout` function. Finally call the `draw` function passsing a callback that will draw all the frames.
```
var sheet = SQR.SpriteSheet()
.layout(10, 10, 60)
.draw(function(ctx, i) {
    var angle = -Math.PI * 2 * (i / this.numFrames * 2);
    var s = this.size / 2, radius = s - 8;

    ctx.translate(s, s);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(Math.cos(0) * radius, Math.sin(0) * radius);
    ctx.arc(0, 0, radius, 0, angle, i < this.numFrames / 2);
    ctx.stroke();
});
```
The draw function is called within the context of the instance of `SQR.SpriteSheet` so properties are available from `this`. Those properties include:
- `this.numFrames` - the total number of frames (rows x cols) of this sprite sheet
- `this.size` - the size of the individual call of the sprite sheet
On top of that the context and the current frame are passed as arguments to the callback. All this information should be enough to draw the animation frame-by-frame. In the example above it draw a little spinner/preloader kind of object.

If all these step go all right, the sprite sheet should be generated. An good way to preview the result is to add the internal canvas of the sprite-sheet to the DOM and see what it looks like:
```
document.body.appendChild(sheet.canvas);
```
This will give a preview of the sprite-sheet and make debugginf easier. When you are satisfied with the result, just remove/comment out this line.

Now, we can easily add it to the main rendering canvas above. We just need to create a transform to hold the animarion and assing the result of the `run` function to the `shape` property:
```
var sprite = new SQR.Transform2d();
// Move the sheet to half its size, becuse sprite sheet animations
// are anchored to center/middle
sprite.position.set(sheet.size / 2, sheet.size / 2);
sprite.shape = sheet.run(1000/60, -1);
```
See API docs for {@link SQR.SpriteSheet} for details about all the arguments to the `run` function.

In the top left corner, next to the sun/earth you should now see a simple spinner!

















