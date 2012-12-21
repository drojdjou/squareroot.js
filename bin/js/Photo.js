Photo = function(src, curve, startT, endT) {
    var ht = document.createElement('div');
    ht.setAttribute('class', 'plane');

    var hti = new Image();
    hti.src = src;
    ht.appendChild(hti);

    var ovr = document.createElement('div');
    ht.appendChild(ovr);

    this.transform = new SQR.Transform();
    this.transform.renderer = new SQR.DOMElement3D(ht);

    var lookDir = new SQR.V3(0, 0, -1);

    this.updatePosition = function(gt) {

        var t = (gt - startT) / (endT - startT);

        t = Math.min(t, 1);
        t = Math.max(t, 0);

        this.transform.position.copyFrom(curve.valueAt(t));

        this.transform.rotation.y = -(t * 2 - 1) * Math.PI;
        this.transform.rotation.x = (t * 2 - 1) * this.transform.position.y / PhotoPath.EDGE * -10;
        this.transform.rotation.z = (t * 4 - 2) * this.transform.rotation.x;

        var a = (t - 0.4) / 0.2;

        a = Math.abs(a - 0.5) * 2;

        a = Math.min(a, 1);
        a = Math.max(a, 0);

        ovr.style.opacity = a;
    }
}