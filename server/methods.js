Meteor.methods({
    'insertArticle': function (fields) {
        if (fields.hasOwnProperty('pages') && typeof fields.pages === 'string') {
            fields.pages = fields.pages.split(',').map(function (x) { return x.trim() });
        }
        if (fields.hasOwnProperty('tags') && typeof fields.tags === 'string') {
            fields.tags = fields.tags.split(',').map(function (x) { return x.trim() });
        }
        ArticleList.insert(fields);
    },
    'updateArticle': function (selectedArticleID, fields) {
        if (fields.hasOwnProperty('pages') && typeof fields.pages === 'string') {
            fields.pages = fields.pages.split(',').map(function (x) { return x.trim() });
        }
        if (fields.hasOwnProperty('tags') && typeof fields.tags === 'string') {
            fields.tags = fields.tags.split(',').map(function (x) { return x.trim() });
        }
        ArticleList.update({_id: selectedArticleID}, fields);
        if (fields.hasOwnProperty('pages') && typeof fields.pages === 'string') {
            fields.pages = fields.pages.split(',').map(function (x) { return x.trim() });
        }
    },
    'removeArticle': function (selectedArticle) {
        ArticleList.remove(selectedArticle);
    }
});
