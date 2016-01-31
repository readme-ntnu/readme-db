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
        const articleFieldName = event.target.id;
        const oldVal = this[articleFieldName];
        var newVal = event.target.innerText.trim();

        // If there's no change, do nothing.
        if (newVal === oldVal) return;

        // If the field being edited is empty and the field is mandatory, display error message and don't update.
        const mandatory = ['edition', 'pages', 'title'];
        if (!newVal && mandatory.indexOf(articleFieldName) > -1) {
            sAlert.error("Feltet kan ikke være tomt.");
            return;
        }

        // If the field is containing an array, split the newVal into an array and compare. If no change, do nothing.
        const arrayFields = ['pages', 'tags'];
        if (typeof oldVal !== 'string' || arrayFields.indexOf(articleFieldName) > -1) {
            newVal = newVal.split(',').map(function (x) { return x.trim() });
            if (equalsArray(oldVal, newVal)) return;
        }
        var inner = {};
        inner[articleFieldName] = newVal;

        // If edition or pages is changed, remember to also update url
        if (articleFieldName === 'edition') {
            inner.url = getUrlFromEdition(newVal, this.pages);
            event.target.innerHTML = '<a href="' + inner.url + '">' + newVal + '</a>';
        }
        else if (articleFieldName === 'pages') {
            inner.url = getUrlFromEdition(this.edition, newVal);
            event.target.innerText = "";
        }
        else {
            event.target.innerText = "";
        }
        Meteor.call('updateArticle', this._id, {$set: inner});
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
