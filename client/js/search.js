Template.search.events({
  'click tr': function() {
    Session.set('selectedArticle', this._id);
  },
  'keyup [type=text]': function(event, template) {
    Session.set('searchText', event.target.value);
  }
});

Template.search.helpers({
  'article': function() {

    // If search field is empty, show all
    if (!Session.get('searchText') || !Session.get('searchText').trim()) {
      return ArticleList.search("").fetch();
    }

    // Array of all space-separated keywords
    var keywords = Session.get("searchText").trim().split(" ");

    // Make a search for each keyword and intersect with resultArray to find articles present in all (i.e. the union)
    var resultArray = ArticleList.search(keywords[0].trim()).fetch();
    for (var i = 1; i < keywords.length; i++) {
      resultArray = intersect(resultArray, ArticleList.search(keywords[i].trim()).fetch());
    }
    return resultArray;
  },
  'selectedClass': function() {
    if (Session.get('selectedArticle') === this._id) {
      return 'selected';
    }
  }
});
