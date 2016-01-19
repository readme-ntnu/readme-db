if (Meteor.isServer) {
    Meteor.methods({
        'insertArticle': function(edition, url, pages, title, author, layout, type, tags) {
            ArticleList.insert({
                "edition": edition,
                "url": url,
                "pages": pages,
                "title": title,
                "author": author,
                "layout": layout,
                "type": type,
                "tags": tags
            });
        },
        'updateArticle': function(selectedArticle, edition, url, pages, title, author, layout, type, tags) {
            ArticleList.update(
                {_id: selectedArticle},
                {
                    "edition": edition,
                    "url": url,
                    "pages": pages,
                    "title": title,
                    "author": author,
                    "layout": layout,
                    "type": type,
                    "tags": tags
                });

        },
        'removeArticle': function(selectedArticle) {
            ArticleList.remove(selectedArticle);
        }
    });
}
