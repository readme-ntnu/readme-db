Template.search.events({
    'click th': function (event) {
        const newVal = event.target.id.substring(3);
        Session.set('sortAscending', (Session.get('sortByColumn') !== newVal) ? true : !Session.get('sortAscending'));
        Session.set('sortByColumn', newVal);
    },
    'click #remove': function () {
        const articleID = this._id;
        if (!articleID) return;
        const title = this.title;
        new Confirmation({
            message: 'Er du sikker på at du vil slette "' + title + '"?',
            title: "Slett artikkel",
            cancelText: "Nei, avbryt",
            okText: "Ja, slett",
            success: false // true: green button, false: red button
        }, function (ok) {
            // ok is true if the user clicked on "ok", false otherwise
            if (!ok) return;
            Meteor.call('removeArticle', articleID, function(error) {
                if (error) sAlert.error('Noe gikk galt!');
                else sAlert.success('"' + title + '" ble fjernet.');
            });
        });
    },
    'click td': function () {
        Session.set('selectedArticle', this._id);
    },
    'keyup [type=text]': function(event, template) {
        Session.set('searchText', event.target.value);
    },
    // Is called when a table cell that is being edited loses focus.
    'blur td': function (event) {
        const articleFieldName = event.target.id;
        const oldVal = this[articleFieldName];
        var newVal = event.target.innerText.trim();
        var article = this;

        // If there's no change, or user not logged in, or the cell clicked is the remove button, do nothing.
        if (newVal === oldVal || !Meteor.user() || articleFieldName === "remove") return;

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
            inner.url = getUrlFromEdition(newVal, article.pages);
            event.target.innerHTML = '<a href="' + inner.url + '">' + newVal + '</a>';
        }
        else if (articleFieldName === 'pages') {
            inner.url = getUrlFromEdition(article.edition, newVal);
            event.target.innerText = "";
        }
        else {
            event.target.innerText = "";
        }
        Meteor.call('updateArticle', article._id, {$set: inner}, function (error) {
            if (error) sAlert.error('Noe gikk galt!');
            else sAlert.success('"' + article.title + '" ble endret. ("' + oldVal + '" --> "' + newVal + '")');
        });
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

        var resultArray;

        // If search field is empty, show all
        if (!Session.get('searchText') || !Session.get('searchText').trim()) {
            resultArray = ArticleList.search("").fetch();
        }
        else {
            // Array of all space-separated keywords
            var keywords = Session.get("searchText").trim().split(" ");

            // Make a search for each keyword and intersect with resultArray to find articles present in all
            resultArray = ArticleList.search(keywords[0].trim()).fetch();
            for (var i = 1; i < keywords.length; i++) {
                resultArray = intersect(resultArray, ArticleList.search(keywords[i].trim()).fetch());
            }
        }

        // Sort by column property
        const sortProp = Session.get('sortByColumn');
        if (!sortProp) return resultArray;

        resultArray.sort(function (a, b) {
            const order = Session.get('sortAscending') ? 1 : -1;
            if (a[sortProp] < b[sortProp]) return -1 * order;
            if (a[sortProp] > b[sortProp]) return order;
            return 0;
        });
        return resultArray;
    }
});
