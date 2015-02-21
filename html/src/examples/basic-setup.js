import SQR from 'SQR';
import Loader from 'common/Loader';
import Context from'common/Context';
import Renderer from 'common/Renderer';
import Transform from 'common/Transform';
import Shader from 'common/Shader';
import Buffer from 'common/Buffer';
import V3 from 'math/Vector3';
import Matrix33 from 'math/Matrix33';
import Matrix44 from 'math/Matrix44';
import Quaternion from 'math/Quaternion';
import ProjectionMatrix from 'math/ProjectionMatrix';
import V2 from 'math/Vector2';
import Face from 'primitives/Face';
import Cube from 'primitives/Cube';


export function main() {

    Loader.loadAssets([
        // Load all the files you need here
        // Each file will be availabke below from the asset object
        // under it's name, ex. assets['normal2color.glsl']
        // It's also possible ot specify an alias. Instead of a String, 
        // use an Array, where [0] is the path, and [1] is the alias.
        ['normal2color.glsl', 'n2c'],
    ], function(assets) {

        var w = window.innerWidth, h = window.innerHeight, aspect = w/h;

        // Create the context based on the #id of the canvas element
        // (there are more options for hw to do that - check the docs)
        // Use chaining to create the GL context and set it's clear color (r,g,b,a)
        var ctx = Context('#gl-canvas').create().clearColor(0, 0, 0, 1);

        // Create a renderer, pass the context to it
        var renderer = new SQR.Renderer(ctx);

        // There is no scene in SQR, a scene is basically just a transform 
        // that holds the entire scene
        var root = new SQR.Transform();

        // Create a camera, make sure to add it to the root (or any if it's children)
        var camera = new SQR.Transform();
        camera.position.z = 5;
        root.add(camera);

        // Create a resize handler and call it once to set the size of the viewport 
        // and the correct projection matrix
        var resize =function() {
            w = window.innerWidth, h = window.innerHeight, aspect = w/h;
            ctx.size(w, h);
            camera.projection = new SQR.ProjectionMatrix().perspective(70, aspect, 1, 1000);
        }

        window.addEventListener('resize', resize);
        resize();

        // Create an object
        var cube = new SQR.Transform();
        // When creating buffers, the buffers are actually populated  
        // in the udate function, so it needs to be called at the end
        // (it returns the instance of the Buffer for chaining)
        cube.buffer = SQR.Primitives.createCube(2, 2, 2).update();
        // Shaders are created from GLSL code loaded thru the SQR.Loader
        cube.shader = SQR.Shader(assets['n2c']);
        // Add the cube to the root
        root.add(cube);

        var render = function() {
            requestAnimationFrame(render);
            ctx.clear();
            cube.rotation.x += 0.005;
            cube.rotation.y += 0.01;
            // Render the scene from the root transform up, directly to screen
            renderer.render(root, camera);
        }

        render();
    });

}