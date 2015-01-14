intersect = function(a, b) {
    var res = [];
    for (var i = 0; i < a.length; i++) {
        for (var j = 0; j < b.length; j++) {
            if (a[i]._id === b[j]._id) {
                res.push(a[i]);
                continue
            }
        }
    }
    return res;
}