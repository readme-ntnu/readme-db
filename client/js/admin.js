Template.admin.events({
    'click #new': function(event, template) {
        event.preventDefault();
        var fields = getFormFields(template);
        if (!formIsOK(template) || articleAlreadyExists(fields.edition, fields.pages, fields.title)) {
            return;
        }
        Meteor.call('insertArticle', fields);
        sAlert.success('Artikkel "' + fields.title + '" ble lagt til.');

        // Make it easier to continue with next article
        template.find("#addPages").focus();
        const nextPage = Number(fields.pages[fields.pages.length - 1]) + 1;
        template.find("#addPages").value = String(nextPage);
        switch (nextPage) {
            case 2:
                template.find("#addType").value = "Leder";
                break;
            case 3:
                template.find("#addType").value = "Side 3";
                break;
            case 8:
                template.find("#addType").value = "Gløsløken";
                break;
            case 14:
                template.find("#addType").value = "Flørt";
                break;
            case 16:
                template.find("#addType").value = "Siving";
                break;
            case 17:
                template.find("#addType").value = "Ikke-siving";
                break;
            case 24:
                template.find("#addType").value = "Utgavens algoritme";
                break;
            case 26:
                template.find("#addType").value = "Utgavens konkurranse";
                break;
            case 27:
                template.find("#addType").value = "Tegneserie";
                break;
            default:
                template.find("#addType").value = "";
                break;
        }
    },
    'click #edit': function(event, template) {
        event.preventDefault();
        const selectedArticleID = Session.get('selectedArticle');
        if (!selectedArticleID) {
            sAlert.error('Ingen artikkel er valgt.');
            return;
        }
        if (formIsOK(template)) {
            const title = template.find("#addTitle").value;
            Meteor.call('updateArticle', selectedArticleID, getFormFields(template));
            sAlert.success('Artikkel "' + title + '" ble endret.');
        }
    },
    'click #remove': function(event, template) {
        const selectedArticle = Session.get('selectedArticle');
        if (!selectedArticle) {
            sAlert.warning('Ingen artikkel er valgt.');
            return;
        }
        const title = template.find("#addTitle").value;
        sAlert.success('Artikkel "' + title + '" ble slettet.');
        Meteor.call('removeArticle', selectedArticle);
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

// Returns the Admin form values as an object which reflects an article
var getFormFields = function (template) {
    var fields = {
        'edition': template.find("#addEdition").value,
        'pages': template.find("#addPages").value.split(","),
        'title': template.find("#addTitle").value,
        'author': template.find("#addAuthor").value,
        'layout': template.find("#addLayout").value,
        'type': template.find("#addType").value,
        'tags': template.find("#addTags").value.split(",")
    };
    fields.url = getUrlFromEdition(fields.edition, fields.pages);
    return fields;
};

// Checks if form is filled out properly. Warns user if it is not.
var formIsOK = function (template) {
    const formFields = getFormFields(template);
    const mandatory = {
        'Utgave': formFields.edition.trim(),
        'Sidetall': formFields.pages.filter(function(x) { return x.trim().length > 0 }),
        'Tittel': formFields.title.trim()
    };
    var ok = true;
    _.each(mandatory, function (value, key) {
        if (!value || value.length < 1) {
            sAlert.error(key + ' mangler.');
            ok = false;
        }
    });
    return ok;
};

// Checks if an article already exists at given page in given edition. Warns user if true.
var articleAlreadyExists = function (edition, pages, title) {
    var articleExists = ArticleList.find({
            'edition': edition,
            'pages': {'$in': pages},
            'title': title
        }).count() > 0;
    if (articleExists) {
        sAlert.error('Denne artikkelen finnes allerede.');
    }
    return articleExists;
};
