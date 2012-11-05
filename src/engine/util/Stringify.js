SQR.Stringify = {

    v2: function(v) {
        return v.x + " | " + v.y;
    },

    v3: function(v) {
        return v.x + " | " + v.y + " | " + v.z;
    },

    m33: function(m) {
        var d = m.data || m;

        return d[0] + "\t|\t" + d[1] + "\t|\t" + d[2] + "\n" +
               d[3] + "\t|\t" + d[4] + "\t|\t" + d[5] + "\n" +
               d[6] + "\t|\t" + d[7] + "\t|\t" + d[8] + "\n";
    },

    m44: function(m) {
        var d = m.data || m;

        var f = function(i) {
            var r = ((Math.abs(d[i]) > 0.0001) ? d[i] : 0);

            r = r.toPrecision(3);

            return r;
        }

        return f(0) + "\t|\t" + f(4) + "\t|\t" + f(8)  + "\t|\t" + f(12) + "\n" +
               f(1) + "\t|\t" + f(5) + "\t|\t" + f(9)  + "\t|\t" + f(13) + "\n" +
               f(2) + "\t|\t" + f(6) + "\t|\t" + f(10) + "\t|\t" + f(14) + "\n" +
               f(3) + "\t|\t" + f(7) + "\t|\t" + f(11) + "\t|\t" + f(15) + "\n";
    }

}