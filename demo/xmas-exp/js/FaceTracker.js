var FaceTracker = function(video, preview) {

	var ft = {};

	ft.deltaX = 0, lastX = 0;

	var SCALE = 4;

	video.width = video.videoWidth;
	video.height = video.videoHeight;

	var w = video.width / SCALE, h = video.height / SCALE;

	var overlay = preview;
	var overlayCC = overlay.getContext('2d');
	var overlayVisible = false;
	overlay.style.display = 'none';

	document.addEventListener('keydown', function(e) {
		if(e.keyCode == 'Q'.charCodeAt(0)) {
			overlayVisible = !overlayVisible;
			overlay.style.display = (overlayVisible) ? 'block' : 'none';
		}
	});

	overlay.width = video.videoWidth / SCALE;
	overlay.height = video.videoHeight / SCALE;

	overlayCC.strokeStyle = '#000000';
	overlayCC.fillStyle = '#000000';

	var img_u8,work_canvas,work_ctx,ii_sum,ii_sqsum,ii_tilted,edg,ii_canny;

	var classifier = jsfeat.haar.frontalface;

	var w = video.width / SCALE, h = video.height / SCALE;

	var img_u8 = new jsfeat.matrix_t(w, h, jsfeat.U8_t | jsfeat.C1_t);
	var edg = new jsfeat.matrix_t(w, h, jsfeat.U8_t | jsfeat.C1_t);
	var ii_sum = new Int32Array((w+1)*(h+1));
	var ii_sqsum = new Int32Array((w+1)*(h+1));
	var ii_tilted = new Int32Array((w+1)*(h+1));
	var ii_canny = new Int32Array((w+1)*(h+1));

	var options = {
		use_canny: false
	};

	var sortByConfidence = function(a, b){
		return (b.confidence < a.confidence);
	}

	var targetFacePos = new SQR.V3();
	var currentFacePos = new SQR.V3();
	ft.facePos = new SQR.V3();

	ft.detect = function() {

		overlayCC.clearRect(0, 0, overlay.width, overlay.height);

	    if (video.readyState === video.HAVE_ENOUGH_DATA) {

	        overlayCC.drawImage(video, 0, 0, w, h);
	        var imageData = overlayCC.getImageData(0, 0, w, h);

	        jsfeat.imgproc.grayscale(imageData.data, w, h, img_u8);

	        jsfeat.imgproc.compute_integral_image(img_u8, ii_sum, ii_sqsum, classifier.tilted ? ii_tilted : null);

	        jsfeat.imgproc.equalize_histogram(img_u8, img_u8);
            jsfeat.imgproc.gaussian_blur(img_u8, img_u8, 3);

	        if(options.use_canny) {
	            jsfeat.imgproc.canny(img_u8, edg, 10, 50);
	            jsfeat.imgproc.compute_integral_image(edg, ii_canny, null, null);
	        }

	        jsfeat.haar.edges_density = options.edges_density;
	        var rects = jsfeat.haar.detect_multi_scale(
	        	ii_sum, 
	        	ii_sqsum, 
	        	ii_tilted, 
	        	options.use_canny? ii_canny : null, 
	        	img_u8.cols, 
	        	img_u8.rows, 
	        	classifier, 
	        	SCALE, 
	        	1
	        );

	        var rects = jsfeat.haar.group_rectangles(rects, 1);
	        

	        var on = rects.length;

	        if(on > 0) {
	        	jsfeat.math.qsort(rects, 0, on-1, sortByConfidence);
		        var r = rects[0];
		        var sc = w/img_u8.cols;
			    targetFacePos.x = (r.x + r.width * 0.5) * sc;
			    targetFacePos.y = (r.y + r.height * 0.5) * sc;	
		    }        
	    }

	    currentFacePos.lerp(currentFacePos, targetFacePos, 0.1);
	    ft.facePos.x = currentFacePos.x / w - 0.5;
	    ft.facePos.y = currentFacePos.y / h - 0.5;

		overlayCC.fillRect(
			currentFacePos.x - 2, 
		 	currentFacePos.y - 2, 
			4, 
			4
		);

		
		

		ft.deltaX = currentFacePos.x - lastX;
		lastX = currentFacePos.x;
	}

	return ft;
}










