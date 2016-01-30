Meteor.methods({
    'insertArticle': function (fields) {
        ArticleList.insert(fields);
    },
    'updateArticle': function(selectedArticleID, fields) {
        ArticleList.update({_id: selectedArticleID}, fields);
    },
    'removeArticle': function (selectedArticle) {
        ArticleList.remove(selectedArticle);
    }
});
