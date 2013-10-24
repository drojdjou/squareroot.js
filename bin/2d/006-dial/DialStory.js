

DialStory = function(ctx, canvasWidth, canvasHeight) {

    var stats, showStats = false;

    if(showStats) {
        stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.body.appendChild(stats.domElement);
    }

    // Some general settings
    var numSegment = 12;// * 6;
    var innerRadius = canvasWidth * 0.2;
    var outerRadius = canvasWidth * 0.4;
    var segments = [];
    var animations = [];
    var startTime, time;

    var timeScale = 1;//0.1;
    var replayCount = -1;


    // Time marks
    var fStart = 100;

    var bStart = 400;
    var bDuration = 200;

    var tInStart = 500;
    var tInDuration = 150;
    var tInSpacing = 600 / numSegment;
    var tInLast = tInStart + numSegment * tInSpacing;
    var tInEnd = tInLast + tInDuration;

    var needleIn = tInEnd + 500;
    var playbackStart = needleIn + 200;
    var playbackTime = 2000;

    var tOutStart = playbackStart + playbackTime + 500;
    var tOutDuration = 350;
    var tOutSpacing = 600 / numSegment;
    var tOutLast = tOutStart + numSegment * tOutSpacing;

    var ringWipeDuration = 500;

    var tDuration = tOutStart + numSegment * tOutSpacing + tOutDuration + 1000;

    createNeedle();
    createMiddleButton();
    createInnerRing();
    create12Segments();

    var animLenght = animations.length;
    var segmentsLength = segments.length;

    this.run = function() {
        startTime = new Date().getTime();
        _run();
    }

    var _run = function() {
        if(showStats) stats.begin();
        requestAnimFrame(_run);

        var animLenght = animations.length;
        var segmentsLength = segments.length;

        time = (new Date().getTime() - startTime) * timeScale;

        var rc = time / tDuration | 0;
        if (rc > replayCount) {
            replayCount = rc;
            for (var i = 0; i < segmentsLength; i++) {
                var s = segments[i];
                if (s.reset) s.reset();
            }
        }

        time = time % tDuration;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        for (var i = 0; i < animLenght; i++) animations[i].update(time);
        for (var i = 0; i < segmentsLength; i++) segments[i].draw(ctx);

        if(showStats) stats.end();
    }


    /// OBJECTS CREATE
    function createNeedle() {

        var n = new Object();

        n.reset = function() {
            this.angle = Math.PI * -0.5;
            this.center = { x: canvasWidth * 0.5, y: canvasHeight * 0.5 };
            this.color = new SQR.Color(0, 0, 100);
            this.width = 10;
            this.radius = 0;
        }

        n.draw = function(ctx) {

            if (this.radius == 0 || this.width == 0) return;

            ctx.save();
            ctx.translate(this.center.x, this.center.y);
            ctx.rotate(this.angle);
            ctx.translate(-this.center.x, -this.center.y);

            ctx.fillStyle = this.color.toHSLString();
            ctx.beginPath();
            ctx.moveTo(this.center.x - this.width * 2, this.center.y);
            ctx.lineTo(this.center.x + this.width * 2, this.center.y);
            ctx.lineTo(this.center.x, this.center.y - this.radius);
            ctx.fill();
            ctx.restore();
        }

        animations.push(new Animation(n, 'radius', innerRadius - 22, tInLast, tInLast + ringWipeDuration * 0.5));
        animations.push(new Animation(n, 'angle', 0, tInLast + ringWipeDuration * 0.5, tInLast + ringWipeDuration));
        animations.push(new Animation(n, 'angle', Math.PI * 2, playbackStart, playbackStart + playbackTime));
        animations.push(new Animation(n, 'radius', 0, tOutStart, tOutStart + ringWipeDuration * 0.5));

        segments.push(n);
    }

    function createMiddleButton() {
        var c = new Circle();
        c.radius = 0;
        c.color = new SQR.Color(0, 0, 100);
        c.center = { x: canvasWidth * 0.5, y: canvasHeight * 0.5 };

        animations.push(new Animation(c, 'radius', innerRadius - 20, bStart, bStart + bDuration));
        animations.push(new Animation(c, 'radius', innerRadius - 40, bStart + bDuration, bStart + bDuration * 2));
        animations.push(new Animation(c.color, 'lightness', 50, bStart + bDuration, bStart + bDuration * 2));
        animations.push(new Animation(c, 'radius', 0, tOutLast, tOutLast + bDuration));
        animations.push(new Animation(c.color, 'lightness', 100, tOutLast, tOutLast + bDuration));

        segments.push(c);
    }

    function createInnerRing() {

        var ir = new PieSlice();

        ir.reset = function() {
            this.startAngle = Math.PI * -2;
            this.angularWidth = Math.PI * 0.25;
            this.startRadius = innerRadius - 16;
            this.endRadius = innerRadius - 6;
            this.color = new SQR.Color(0, 100, 100);
            this.margin = 0;
            this.center = { x: canvasWidth * 0.5, y: canvasHeight * 0.5 };
        }

        animations.push(new Animation(ir, 'startAngle', Math.PI * -0.5, fStart, tInStart, null, Math.PI * -2));
        animations.push(new Animation(ir, 'angularWidth', Math.PI * 2, tInStart, tInLast));
        animations.push(new Animation(ir, 'angularWidth', 0, tInLast, tInLast + ringWipeDuration));
        animations.push(new Animation(ir, 'startAngle', Math.PI * 1.5, tInLast, tInLast + ringWipeDuration));
        animations.push(new Animation(ir, 'angularWidth', Math.PI * 2, tOutStart, tOutLast));
        animations.push(new Animation(ir, 'startAngle', Math.PI * -0.5, tOutStart, tOutLast));
        animations.push(new Animation(ir, 'angularWidth', 0, tOutLast, tOutLast + ringWipeDuration));

        segments.push(ir);
    }

    function create12Segments() {
        var aw = Math.PI * 2 / numSegment;

        for (var i = 0; i < numSegment; i++) {
            var p = new PieSlice();

            p.resetAngle = aw * i - Math.PI * 0.5;
            var h = Math.abs(i / numSegment * 80);//510 - 255);
            p.resetColor = new SQR.Color(h, 0, 10);
            p.color = new SQR.Color(h, 0, 10);

            p.reset = function() {

                this.startAngle = this.resetAngle;
                this.angularWidth = aw;
                this.startRadius = innerRadius;
                this.margin = 6;
                this.endRadius = innerRadius;
                this.center = { x: canvasWidth * 0.5, y: canvasHeight * 0.5 };

                this.useBump = 0;
                this.maxBump = 30;
                this.bumpPhase = 0;
                this.bumpSpeed = 0.1 + 0.03 * Math.random();


                this.color.set(this.resetColor.hue, this.resetColor.saturation, this.resetColor.lightness);
            };

            segments.push(p);

            var pIn = tInStart + i * tInSpacing;
            var pOut = tOutStart + (numSegment - i) * tOutSpacing;

            animations.push(new Animation(p, 'endRadius', outerRadius, pIn, pIn + tInDuration));
            animations.push(new Animation(p, 'endRadius', innerRadius, pOut, pOut + tInDuration));

            var ps = playbackTime / numSegment;

            var ps0 = playbackStart + ps * (i + 0);
            var ps1 = playbackStart + ps * (i + 1);

            animations.push(new Animation(p, 'useBump', 1, ps0 - 50, ps0 + 200));
            animations.push(new Animation(p.color, 'lightness', 50, ps0 - 50, ps0 + 200));
            animations.push(new Animation(p.color, 'saturation', 100, ps0 - 50, ps0 + 200));

            animations.push(new Animation(p, 'useBump', 0, ps1 - 50, ps1 + 200));

        }
    }
}