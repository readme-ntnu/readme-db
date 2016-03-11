Template.admin.events({
    'click #new': function(event, template) {
        if (!Helpers.checkConnectionStatus()) return;
        event.preventDefault();
        var fields = getFormFields(template);
        if (!formIsOK(template) || articleAlreadyExists(fields.edition, fields.pages, fields.title)) {
            return;
        }
        Meteor.call('insertArticle', fields, function (error, result) {
            if (error) {
                sAlert.error(Defaults.errorMessageFromServer);
                return;
            }
            Session.set('selectedArticle', result);
            sAlert.success('Artikkel "' + fields.title + '" ble lagt til.');
        });

        // Make it easier to continue with next article
        template.find("#addPages").focus();
        const nextPage = String(Number(fields.pages[fields.pages.length - 1]) + 1);
        template.find("#addPages").value = nextPage;
        template.find("#addType").value = ArticleConfig.types[nextPage] || "";
    },
    'click #edit': function(event, template) {
        if (!Helpers.checkConnectionStatus()) return;
        event.preventDefault();
        if (formIsOK(template)) {
            const title = template.find("#addTitle").value;
            Meteor.call('updateArticle', Session.get('selectedArticle'), getFormFields(template), function (error) {
                if (error) sAlert.error(Defaults.errorMessageFromServer);
                else sAlert.success('Artikkel "' + title + '" ble endret.');
            });
        }
    },
    'click #remove': function(event, template) {
        if (!Helpers.checkConnectionStatus()) return;
        const title = template.find("#addTitle").value;
        Meteor.call('removeArticle', Session.get('selectedArticle'), function (error) {
            if (error) {
                sAlert.error(Defaults.errorMessageFromServer);
                return;
            }
            sAlert.success('Artikkel "' + title + '" ble slettet.');
            Session.set('selectedArticle', null);
        });
    }
});

Template.admin.helpers({
    'noArticleSelected': function () {
        return !Session.get('selectedArticle');
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
    fields.url = Helpers.getUrlFromEdition(fields.edition, fields.pages);
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
