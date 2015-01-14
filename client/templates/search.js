Template.search.events({
    'click tr': function() {
        Session.set('selectedArticle', this._id);
        var selectedArticle = Session.get('selectedArticle');
    },
    'keyup [type=text]': function(event, template) {
        Session.set('searchText', event.target.value);
    }
});

Template.search.helpers({
    'article': function() {
        var result_array = [];
        if (Session.get('searchText') && Session.get('searchText').trim()) {
            var search_array = Session.get("searchText").trim().split(" ");
            result_array = ArticleList.search(search_array[0].trim()).fetch();
            for (var i=1; i<search_array.length; i++) {
                var r = ArticleList.search(search_array[i].trim()).fetch();
                result_array = intersect(result_array, r);
            }
            return result_array;
        }
        return ArticleList.search("").fetch();
    },
    'selectedClass': function () {
        if (Session.get('selectedArticle') === this._id) {
            return 'selected';
        }
    }
});