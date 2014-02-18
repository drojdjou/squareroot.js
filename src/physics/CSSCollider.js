SQR.CSSCollider = function(width, height) {

    var w = width * 0.5;
    var h = height * 0.5;

    var a = new SQR.V3(-w,  h, 0);
    var b = new SQR.V3( w,  h, 0);
    var c = new SQR.V3( w, -h, 0);
    var d = new SQR.V3(-w, -h, 0);

    var pa = new SQR.V3();
    var pb = new SQR.V3();
    var pc = new SQR.V3();
    var pd = new SQR.V3();

    var m = new SQR.V2();

    var mvp = new SQR.Matrix44();

    function projectPoint(p, pp, cx, cy) {

        mvp.transformVector(p, pp);

        pp.x = pp.x / pp.z * cx + cx;
        pp.y = pp.y / pp.z * cy + cy;
    }

    this.project = function(transform, uniforms) {
        uniforms.projection.copyTo(mvp);
        mvp.multiply(transform.viewMatrix);

        projectPoint(a, pa, uniforms.centerX, uniforms.centerY);
        projectPoint(b, pb, uniforms.centerX, uniforms.centerY);
        projectPoint(c, pc, uniforms.centerX, uniforms.centerY);
        projectPoint(d, pd, uniforms.centerX, uniforms.centerY);

//        var ctx = uniforms.context;
//        ctx.fillStyle = 'red';
//        ctx.fillRect(pa.x-2, pa.y-2, 4, 4);
//        ctx.fillRect(pb.x-2, pb.y-2, 4, 4);
//        ctx.fillRect(pc.x-2, pc.y-2, 4, 4);
//        ctx.fillRect(pd.x-2, pd.y-2, 4, 4);
    }

    this.intersects = function(mx, my) {
        m.set(mx, my);

        var ta = pointInTri(m, pa, pb, pc);
        var tb = pointInTri(m, pa, pc, pd);
        
        return ta || tb;
    }

    var sing = function(p1, p2, p3) {
        return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    }

    var pointInTri = function(mp, p1, p2, p3) {

        var b1 = sing(mp, p1, p2) < 0.0;
        var b2 = sing(mp, p2, p3) < 0.0;
        var b3 = sing(mp, p3, p1) < 0.0;

        return ((b1 == b2) && (b2 == b3));
    }

}