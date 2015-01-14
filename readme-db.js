articleList = new Meteor.Collection("articles");

if (Meteor.isClient) {

    articleList.search = function(query) {
        var q = query ? query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') : "";
        return articleList.find({
            $or: [
                {edition: { $regex: q, $options: 'i'}},
                {pages: { $regex: q, $options: 'i'}},
                {title: { $regex: q, $options: 'i'}},
                {author: { $regex: q, $options: 'i'}},
                {layout: { $regex: q, $options: 'i'}},
                {type: { $regex: q, $options: 'i'}},
                {tags: { $regex: q, $options: 'i'}}
        ]});
    }

    Template.search.events({
        'click tr': function() {
            Session.set('selectedArticle', this._id);
            var selectedArticle = Session.get('selectedArticle');
        },
        'keyup [type=text]': function(event, template) {
            Session.set('searchText', event.target.value);
        }
    });

    var intersect = function(a, b) {
        var res = [];
        for (var i=0; i< a.length; i++) {
            for (var j=0; j< b.length; j++) {
                if (a[i]._id === b[j]._id) {
                    res.push(a[i]);
                    continue
                }
            }
        }
        return res;
    }

    Template.search.helpers({
        'article': function() {
            var result_array = [];
            if (Session.get('searchText') && Session.get('searchText').trim()) {
                var search_array = Session.get("searchText").trim().split(" ");
                result_array = articleList.search(search_array[0].trim()).fetch();
                for (var i=1; i<search_array.length; i++) {
                    var r = articleList.search(search_array[i].trim()).fetch();
                    result_array = intersect(result_array, r);
                }
                return result_array;
            }
            return articleList.search("").fetch();
        },
       'selectedClass': function () {
            if (Session.get('selectedArticle') === this._id) {
                return 'selected';
            }
        }
    });

    Template.admin.events({
        'click #new': function(event, template) {
            event.preventDefault();
            var edition = template.find("#addEdition").value;
            var pages = template.find("#addPages").value.split(",");
            var title = template.find("#addTitle").value;
            var author = template.find("#addAuthor").value;
            var layout = template.find("#addLayout").value;
            var type = template.find("#addType").value;
            var tags = template.find("#addTags").value.split(",");
            Meteor.call('insertArticle', edition, pages, title, author, layout, type, tags);
        },
        'click #edit': function(theEvent, template) {
            theEvent.preventDefault();
            var selectedArticle = Session.get('selectedArticle');
            var edition = template.find("#addEdition").value;
            var pages = template.find("#addPages").value.split(",");
            var title = template.find("#addTitle").value;
            var author = template.find("#addAuthor").value;
            var layout = template.find("#addLayout").value;
            var type = template.find("#addType").value;
            var tags = template.find("#addTags").value.split(",");
            Meteor.call('updateArticle', selectedArticle, edition, pages, title, author, layout, type, tags);
        },
        'click #remove': function(theEvent, theTemplate) {
            Meteor.call('removeArticle', Session.get('selectedArticle'));
        },
        'click #empty': function() {
            Session.set('selectedArticle', null);
        }
    });

    Template.admin.helpers({

        'edition': function () {
            if (Session.get('selectedArticle'))
                return articleList.find({_id: Session.get('selectedArticle')}).fetch()[0].edition;
        },
        'pages': function () {
            if (Session.get('selectedArticle'))
                return articleList.find({_id: Session.get('selectedArticle')}).fetch()[0].pages;
        },
        'title': function () {
            if (Session.get('selectedArticle'))
               return articleList.find({_id: Session.get('selectedArticle')}).fetch()[0].title;
        },
        'author': function () {
            if (Session.get('selectedArticle'))
                return articleList.find({_id: Session.get('selectedArticle')}).fetch()[0].author;
        },
        'layout': function () {
            if (Session.get('selectedArticle'))
                return articleList.find({_id: Session.get('selectedArticle')}).fetch()[0].layout;
        },
        'type': function () {
            if (Session.get('selectedArticle'))
                return articleList.find({_id: Session.get('selectedArticle')}).fetch()[0].type;
        },
        'tags': function () {
            if (Session.get('selectedArticle'))
                return articleList.find({_id: Session.get('selectedArticle')}).fetch()[0].tags;
        }
    });
}

if (Meteor.isServer) {

    Meteor.methods({
        'insertArticle': function(edition, pages, title, author, layout, type, tags) {
            articleList.insert({
                "edition": edition,
                "pages": pages,
                "title": title,
                "author": author,
                "layout": layout,
                "type": type,
                "tags": tags
            });
        },
        'updateArticle': function(selectedArticle, edition, pages, title, author, layout, type, tags) {
            articleList.update(
                {_id: selectedArticle},
                {"edition": edition,
                    "pages": pages,
                    "title": title,
                    "author": author,
                    "layout": layout,
                    "type": type,
                    "tags": tags
            });

        },
        'removeArticle': function(selectedArticle) {
            articleList.remove(selectedArticle);
       }
    });
}
