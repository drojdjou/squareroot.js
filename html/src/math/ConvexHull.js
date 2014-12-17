SQR.ConvexHull = (function() {

	// based on algorithm from Chapter 1 in 
	// http://www.amazon.com/dp/3540779736/?tag=stackoverfl08-20

	// and code from 
	// http://blog.cedric.ws/draw-the-convex-hull-with-canvas-and-javascript
	// (which is basically the implementation of the algorithm explained in the book above)

	var upper = [], lower = [], hull = [];

	var sortXY = function(a, b) {
		if(a.x == b.x) return a.y - b.y;
		else return a.x - b.x;
	}

	var isRight = function(a, b, c){
		return ( 
			(c.x * a.y - c.y * a.x) - 
			(b.x * a.y - b.y * a.x) + 
			(b.x * c.y - b.y * c.x)) < 0;
	}

	var upperHull = function(p, u) {

		u.push(p[0]);
		u.push(p[1]);

		for(var i = 2, l = p.length; i < l; i++) {

			u.push(p[i]);

			while(u.length > 2 &&
				!isRight(
					u[u.length-3],
					u[u.length-1],
					u[u.length-2]
				)
			) {
				u.splice(
					u.indexOf(u[u.length-2]), 
					1
				);
			}
		}

		return u;
	}

	var lowerhull = function(p, u){

		u.push(p[p.length-1]);
		u.push(p[p.length-2]);

		for(var i = p.length-3; i >= 0; i--) {
			u.push(p[i]);

			while(u.length > 2 &&
				!isRight(
					u[u.length-3], 
					u[u.length-1],
					u[u.length-2]
				)
			) {
				u.splice(
					u.indexOf(u[u.length-2]), 
					1
				);
			}
		}

		return u;
	}

	return {
		compute: function(p, h) {

			if(!h) h = hull;

			upper.length = 0, lower.length = 0, h.length = 0;

			p.sort(sortXY);

			upperHull(p, upper);
			lowerhull(p, lower);

			h = h.concat(upper, lower);

			return h;
		}
	}

})();


/* 

Other links: 
http://www.travellermap.com/tmp/delaunay.js
https://github.com/ironwallaby/delaunay/blob/master/delaunay.js
http://paulbourke.net/papers/triangulate/

*/








