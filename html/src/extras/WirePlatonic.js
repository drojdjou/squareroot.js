// https://api.tinkercad.com/libraries/1vxKXGNaLtr/0/docs/topic/Platonic+Solid+Generator+-+Part+1.html
// https://api.tinkercad.com/libraries/1vxKXGNaLtr/0/docs/topic/Platonic+Solid+Generator+-+Part+2.html

SQR.WirePlatonic = {

	pyramid: function(size, dotsOnly) {

		var s = size * 0.5;
		var h = size * 0.5;

		var b = SQR.Buffer()
			.layout(SQR.v3(), 5)
			.data('aPosition', 
				 0,	 h,  0,	// 0 tip
				-s, -h,  s, // 1 front bottom left
				 s, -h,  s, // 2 front bottom right
				-s, -h, -s,	// 3 back bottom left
				 s, -h, -s  // 4 back bottom right
			);

		if(!dotsOnly) {
			b.index(
				0, 1, 0, 2, 0, 3, 0, 4, // tip to base
				1, 3, 2, 4, 1, 2, 3, 4  // sides
			);
		}
			
		return b;
	},

	octahedron: function(diameter, dotsOnly) {
		var r = diameter * 0.5;
		var a = Math.PI / 2;

		var ps = [];

		for (var i = 0; i < 4; i++) {
			var x = r * Math.cos(i * a);
			var y = r * Math.sin(i * a);
			ps.push(x, y, 0);
		}

		ps.push(0, 0,  r);
		ps.push(0, 0, -r);

		var b = SQR.Buffer()
			.layout(SQR.v3(), 6)
			.data('aPosition', ps);

		if(!dotsOnly) {
			b.index(
				0, 1, 1, 2, 2, 3, 3, 0, // base
				4, 0, 4, 1, 4, 2, 4, 3, // top to base
				5, 0, 5, 1, 5, 2, 5, 3  // bottom to base
			);
		}
			
		return b;
	},

	cube: function(size, dotsOnly) {

		var s = size * 0.5;

		var b = SQR.Buffer()
			.layout(SQR.v3(), 8)
			.data('aPosition', 
				-s,  s,  s, // 0 front top left
				 s,  s,  s, // 1 front top right
				-s, -s,  s, // 2 front bottom left
				 s, -s,  s, // 3 front bottom right
				-s,  s, -s,	// 4 back top left
				 s,  s, -s, // 5 back top right
				-s, -s, -s,	// 6 back bottom left
				 s, -s, -s  // 7 back bottom right
			);

		if(!dotsOnly) {
			b.index(
				0, 1, 0, 2, 1, 3, 2, 3, // front
				4, 5, 4, 6, 5, 7, 6, 7, // back
				0, 4, 1, 5, 2, 6, 3, 7  // sides
			);
		}
			
		return b;
	},

	dodecahedron: function(size, dotsOnly) {

		var s = size * 0.5;
		var phi = (1 + Math.sqrt(5)) / 2;  // The golden ratio, ~1.618
		var p = s * phi;
		var ip = s * (1 / phi);

		var b = SQR.Buffer()
			.layout(SQR.v3(), 20)
			.data('aPosition', 
				-s,  s,  s,  // 0 front top left
				 s,  s,  s,  // 1 front top right

				-s, -s,  s,  // 2 front bottom left
				 s, -s,  s,  // 3 front bottom right

				-s,  s, -s,	 // 4 back top left
				 s,  s, -s,  // 5 back top right

				-s, -s, -s,	 // 6 back bottom left
				 s, -s, -s,  // 7 back bottom right

				 0,  ip,  p, // 8 y-z plane (green)
				 0, -ip,  p, // 9
				 0,  ip, -p, // 10
				 0, -ip, -p, // 11

			    -p,  0,  ip, // 12 x-z plane (pink)
				-p,  0, -ip, // 13
				 p,  0,  ip, // 14
				 p,  0, -ip, // 15

				-ip,  p,  0, // 16 x-y plane (blue)
				 ip,  p,  0, // 17
				 ip, -p,  0, // 18
				-ip, -p,  0  // 19

			);

		if(!dotsOnly) {
			b.index(
				8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, // phi rects edges

				8,  0,  8,  1,  9,  2,  9,  3,
				10, 4,  10, 5, 11,  6, 11,  7,

				12, 0, 12, 2, 13, 4, 13, 6,
				14, 1, 14, 3, 15, 5, 15, 7,

				16, 0, 16, 4, 17, 1, 17, 5,
				18, 3, 18, 7, 19, 2, 19, 6

			);
		}
			
		return b;
	},

	icosahedron: function(size, dotsOnly) {

		var r = size * 0.5;
		var t = (1.0 + Math.sqrt(5.0)) * 0.5 * r;
		var ps = [];

		var av = function(x, y, z) {
		    var v = new SQR.V3(x, y, z).norm().mul(r);
		    ps.push(v.x, v.y, v.z);
		}

		av(-r,  t,  0); // 0
		av( r,  t,  0); // 1
		av(-r, -t,  0); // 2
		av( r, -t,  0); // 3

		av( 0, -r,  t); // 4
		av( 0,  r,  t); // 5
		av( 0, -r, -t); // 6
		av( 0,  r, -t); // 7

		av( t,  0, -r); // 8
		av( t,  0,  r); // 9
		av(-t,  0, -r); // 10
		av(-t,  0,  r); // 11

		var b = SQR.Buffer()
			.layout(SQR.v3(), 12)
			.data('aPosition', ps);

		if(!dotsOnly) {
			b.index(
				0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,

				0, 5, 1, 5, 0, 7, 1, 7,
				2, 6, 3, 6, 2, 4, 3, 4,

				8, 1, 8, 3, 10, 0, 10, 2,
				9, 1, 9, 3, 11, 0, 11, 2,
				
				8, 6, 8, 7, 10, 6, 10, 7,
				9, 4, 9, 5, 11, 4, 11, 5
			);
		}
			
		return b; 
	}
};