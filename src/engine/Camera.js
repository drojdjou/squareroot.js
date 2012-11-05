SQR.Camera = function(fov) {

    this.fov = fov;
    this.projection = new SQR.ProjectionMatrix();

    this.setProjection = function(width, height) {
        this.cssDistance = 0.5 / Math.tan(fov * Math.PI / 360) * height;
        this.projection.perspective(fov, uniforms.width / height, 0.1, 1000);
        if (divContainer) divContainer.style['-webkit-perspective'] = this.cssDistance;
    }
}