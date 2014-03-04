/**
 *  Creates a ribbon geometry.
 *  @returns geometry {SQR.Geometry}
 */
SQR.Ribbon = function(curve, options) {
    var that = this;
    SQR.GeometryNew.call(this);

    options = options || {};
    var r = options.resolution || 100;

    this.fromPos = function() {
	    for(var i = 0; i <= r; i++) {
	        var v = new SQR.Vertex();
	        var p = curve.valueAt(i/r).clone();
	        v.add(SQR.Vertex.POSITION, p);
	        that.vertices.push(v);
	    }

	    return that;
    }

    this.fromVelocity = function() {
	    for(var i = 0; i <= r; i++) {
	        var p = curve.valueAt(i/r).clone();

	        var p1 = curve.velocityAt(i/r).clone().norm().mul(30).appendVec(p);
	        var p2 = curve.velocityAt(i/r).clone().norm().mul(-30).appendVec(p);

	        var v1 = new SQR.Vertex();
	        v1.add(SQR.Vertex.POSITION, p1);

	        var v2 = new SQR.Vertex();
	        v2.add(SQR.Vertex.POSITION, p2);

	        that.vertices.push(v1, v2);
	    }

	    return that;
	}

	
	this.fromNormal = function() {
	    for(var i = 1; i < r; i++) {

	    	var pu1 = curve.valueAt(i/r-0.1).clone();
	    	var pu2 = curve.valueAt(i/r+0.1).clone();
	    	var p = curve.valueAt(i/r).clone();

	    	var du1 = new SQR.V3().sub(pu1, p);
	    	var du2 = new SQR.V3().sub(pu2, p);

	    	var up = new SQR.V3().add(du1, du2).norm();
	    	
	        var v = curve.velocityAt(i/r).clone().norm();

	        var n = new SQR.V3().cross(v, up).norm();

	        var p1 = n.clone().mul( 30).appendVec(p);
	        var p2 = n.clone().mul(-30).appendVec(p);

	        var v1 = new SQR.Vertex();
	        v1.add(SQR.Vertex.POSITION, p1);

	        var v2 = new SQR.Vertex();
	        v2.add(SQR.Vertex.POSITION, p2);

	        that.vertices.push(v1, v2);
	    }

	    return that;
	}
}

SQR.Ribbon.prototype = new SQR.GeometryNew();
SQR.Ribbon.prototype.constructor = SQR.GeometryNew; 
