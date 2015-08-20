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
    Meteor.call('insertArticle', edition, url, pages, title, author, layout, type, tags);
  },
  'click #edit': function(theEvent, template) {
    theEvent.preventDefault();
    var selectedArticle = Session.get('selectedArticle');
    var edition = template.find("#addEdition").value;
    var url = template.find("#addUrl").value;
    var pages = template.find("#addPages").value.split(",");
    var title = template.find("#addTitle").value;
    var author = template.find("#addAuthor").value;
    var layout = template.find("#addLayout").value;
    var type = template.find("#addType").value;
    var tags = template.find("#addTags").value.split(",");
    Meteor.call('updateArticle', selectedArticle, edition, url, pages, title, author, layout, type, tags);
  },
  'click #remove': function(theEvent, theTemplate) {
    Meteor.call('removeArticle', Session.get('selectedArticle'));
  },
  'click #empty': function() {
    Session.set('selectedArticle', null);
  }
});

Template.admin.helpers({

  'files': function() {
    return Files.find().fetch();
  },
  'edition': function () {
    if (Session.get('selectedArticle'))
      return ArticleList.find({_id: Session.get('selectedArticle')}).fetch()[0].edition;
  },
  'url': function () {
    if (Session.get('selectedArticle'))
      return ArticleList.find({_id: Session.get('selectedArticle')}).fetch()[0].url;
  },
  'pages': function () {
    if (Session.get('selectedArticle'))
      return ArticleList.find({_id: Session.get('selectedArticle')}).fetch()[0].pages;
    },
  'title': function () {
    if (Session.get('selectedArticle'))
      return ArticleList.find({_id: Session.get('selectedArticle')}).fetch()[0].title;
  },
  'author': function () {
    if (Session.get('selectedArticle'))
      return ArticleList.find({_id: Session.get('selectedArticle')}).fetch()[0].author;
  },
  'layout': function () {
    if (Session.get('selectedArticle'))
      return ArticleList.find({_id: Session.get('selectedArticle')}).fetch()[0].layout;
  },
  'type': function () {
    if (Session.get('selectedArticle'))
      return ArticleList.find({_id: Session.get('selectedArticle')}).fetch()[0].type;
  },
  'tags': function () {
    if (Session.get('selectedArticle'))
      return ArticleList.find({_id: Session.get('selectedArticle')}).fetch()[0].tags;
  }
});
