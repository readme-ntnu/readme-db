// Various helper methods
Helpers = {

    // Finds the intersection of two arrays of search results
    intersect: function (a, b) {
        var res = [];
        for (var i = 0; i < a.length; i++) {
            for (var j = 0; j < b.length; j++) {
                if (a[i]._id === b[j]._id) {
                    res.push(a[i]);
                }
            }
        }
        return res;
    },

    // Checks if two arrays are equal. Enforces order, so that i.e. equalsArray([1, 2], [2, 1]) returns false.
    equalsArray: function (a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;

        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) { return false; }
        }
        return true;
    },

    // Computes the correct url from the edition and pages properties of an article
    getUrlFromEdition: function (edition, pages) {
        const y = edition.substring(0, 4);
        const p = (edition === '2013-05') ? pages[0] : String(Math.floor(Number(pages[0]) / 2) + 1);
        const base = 'http://readme.abakus.no/';
        return (edition >= '2013-05') ? base + 'utgaver/' + y + '/' + edition + '.pdf#page=' + p :  base + '#' + edition;
    }

};
