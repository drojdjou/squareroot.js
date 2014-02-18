SQR.Stringify = (function() {

    var s = {}, d;

    var noe = function (n) {
        return Math.abs(n) < 0.000001 ? 0 : n;
    }

    var vf = function(r) {
        r = r.toPrecision(3);
        r = noe(r);
        if(r == 0) return " 0.000";
        if(r > 0) return " " + r;
        else return r;
    } 

    var f = function(i) {
        var r = ((Math.abs(d[i]) > 0.0001) ? d[i] : 0);
        r = r.toPrecision(3);
        r = noe(r)

        if(r == 0) return i + "/0.000";
        if(r > 0) return i + "/" + r;
        else return i + "/" + r;
    }

    s.v2 = function(v) {
        return vf(v.x) + " | " + vf(v.y);
    }

    s.v3 = function(v) {
        return vf(v.x) + " | " + vf(v.y) + " | " + vf(v.z);
    }

    s.q = function(q) {
        return f(q.w) + " || " + f(q.x) + " | " + f(q.y) + " | " + f(q.z);
    }

    s.m33 = function(m) {
        d = m.data || m;

        return f(0) + "\t|\t" + f(3) + "\t|\t" + f(6) + "\n" +
               f(1) + "\t|\t" + f(4) + "\t|\t" + f(7) + "\n" +
               f(2) + "\t|\t" + f(5) + "\t|\t" + f(8) + "\n";
    }

    s.m44 = function(m) {
        d = m.data || m;

        return f(0) + "\t|\t" + f(4) + "\t|\t" + f(8)  + "\t|\t" + f(12) + "\n" +
               f(1) + "\t|\t" + f(5) + "\t|\t" + f(9)  + "\t|\t" + f(13) + "\n" +
               f(2) + "\t|\t" + f(6) + "\t|\t" + f(10) + "\t|\t" + f(14) + "\n" +
               f(3) + "\t|\t" + f(7) + "\t|\t" + f(11) + "\t|\t" + f(15) + "\n";
    }

    return s;

})();