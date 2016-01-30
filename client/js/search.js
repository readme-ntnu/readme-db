Template.search.events({
    'click tr': function() {
        Session.set('selectedArticle', this._id);
        if (Meteor.userId()) {
            sAlert.info('Artikkel "' + this.title + '" valgt. For å endre/fjerne <a href="/admin">trykk her.</a>', {html: true});
        }
    },
    'keyup [type=text]': function(event, template) {
        Session.set('searchText', event.target.value);
    },
    'blur td': function (event) {
        console.log("BLUR!");
        var inner = {};
        const articleFieldName = event.target.id;
        const newValue = event.target.innerText;
        inner[articleFieldName] = newValue;
        const fields = {$set: inner};
        event.target.innerText = "";
        Meteor.call('updateArticle', Session.get('selectedArticle'), fields);
        sAlert.success('"' + this.title + '" ble endret.');
    }
});

Template.search.helpers({

    'loggedIn': function () {
        return Meteor.user() != null;
    },
    // Updates URL without loading page. Makes sure the search text field's value equals the searchText variable.
    'searchText': function() {
        if (!Session.get('searchText') || Session.get('searchText').trim().length <= 0) {
            history.pushState({}, "", "/");
            return "";
        }
        history.pushState({}, "", Session.get('searchText'));
        return Session.get('searchText');
    },
    'article': function() {

        // If search field is empty, show all
        if (!Session.get('searchText') || !Session.get('searchText').trim()) {
            return ArticleList.search("").fetch();
        }

        // Array of all space-separated keywords
        var keywords = Session.get("searchText").trim().split(" ");

        // Make a search for each keyword and intersect with resultArray to find articles present in all
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
