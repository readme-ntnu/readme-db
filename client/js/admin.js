Template.admin.events({
    'click #new': function(event, template) {
        event.preventDefault();
        var edition = template.find("#addEdition").value;
        var url = template.find("#addUrl").value;
        var pages = template.find("#addPages").value.split(",");
        var title = template.find("#addTitle").value;
        var author = template.find("#addAuthor").value;
        var layout = template.find("#addLayout").value;
        var type = template.find("#addType").value;
        var tags = template.find("#addTags").value.split(",");

        const mandatoryFields = {
            'Utgave': edition,
            'URL': url,
            'Sidetall': pages,
            'Tittel': title
        };

        if (formIsOK(mandatoryFields) && !articleAlreadyExists(edition, pages)) {
            Meteor.call('insertArticle', edition, url, pages, title, author, layout, type, tags);
            sAlert.success('Artikkel "' + title + '" ble lagt til.');
        }
    },
    'click #edit': function(event, template) {
        event.preventDefault();
        var selectedArticle = Session.get('selectedArticle');
        var edition = template.find("#addEdition").value;
        var url = template.find("#addUrl").value;
        var pages = template.find("#addPages").value.split(",");
        var title = template.find("#addTitle").value;
        var author = template.find("#addAuthor").value;
        var layout = template.find("#addLayout").value;
        var type = template.find("#addType").value;
        var tags = template.find("#addTags").value.split(",");

        var mandatoryFields = {
            'Utgave': edition,
            'URL': url,
            'Sidetall': pages,
            'Tittel': title
        };

        if (!selectedArticle) {
            sAlert.error('Ingen artikkel er valgt.');
        }
        else if (formIsOK(mandatoryFields)) {
            Meteor.call('updateArticle', selectedArticle, edition, url, pages, title, author, layout, type, tags);
            sAlert.success('Artikkel "' + title + '" ble endret.');
        }
    },
    'click #remove': function(event, template) {
        var selectedArticle = Session.get('selectedArticle');
        var title = template.find("#addTitle").value;
        Meteor.call('removeArticle', selectedArticle);
        if (!selectedArticle) {
            sAlert.warning('Ingen artikkel er valgt.');
        }
        else {
            sAlert.success('Artikkel "' + title + '" ble fjernet.');
        }
        Session.set('selectedArticle', null);
    },
    'click #empty': function() {
        Session.set('selectedArticle', null);
    }
});

Template.admin.helpers({

    'edition': function () {
        if (Session.get('selectedArticle'))
            return ArticleList.findOne({_id: Session.get('selectedArticle')}).edition;
    },
    'url': function () {
        if (Session.get('selectedArticle'))
            return ArticleList.findOne({_id: Session.get('selectedArticle')}).url;
    },
    'pages': function () {
        if (Session.get('selectedArticle'))
            return ArticleList.findOne({_id: Session.get('selectedArticle')}).pages;
    },
    'title': function () {
        if (Session.get('selectedArticle'))
            return ArticleList.findOne({_id: Session.get('selectedArticle')}).title;
    },
    'author': function () {
        if (Session.get('selectedArticle'))
            return ArticleList.findOne({_id: Session.get('selectedArticle')}).author;
    },
    'layout': function () {
        if (Session.get('selectedArticle'))
            return ArticleList.findOne({_id: Session.get('selectedArticle')}).layout;
    },
    'type': function () {
        if (Session.get('selectedArticle'))
            return ArticleList.findOne({_id: Session.get('selectedArticle')}).type;
    },
    'tags': function () {
        if (Session.get('selectedArticle'))
            return ArticleList.findOne({_id: Session.get('selectedArticle')}).tags;
    }
});

// Checks if form is filled out properly. Warns user if it is not.
var formIsOK = function (fieldsToCheckObject) {
    var ok = true;
    _.each(fieldsToCheckObject, function (value, key) {
        if (!value || value.length === 0) {
            sAlert.warning(key + ' mangler.');
            ok = false;
        }
    });
    return ok;
};

// Checks if an article already exists at given page in given edition. Warns user if true.
var articleAlreadyExists = function (edition, pages) {
    var articleExists = ArticleList.find(
            {
                'edition': edition,
                'pages': {'$in': pages}
            }).count() > 0;
    if (articleExists) {
        sAlert.warning('Det finnes allerede en artikkel på side ' + pages + ' i utgave ' + edition + '.');
    }
    return articleExists;
};
