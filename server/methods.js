import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import ArticleList from '../lib/ArticleList';

Meteor.methods({
  insertArticle(argFields) {
    check(argFields, Object);

    const fields = { ...argFields };

    if (fields.pages && typeof fields.pages === 'string') {
      fields.pages = fields.pages.split(',').map(x => x.trim());
    }
    if (fields.tags && typeof fields.tags === 'string') {
      fields.tags = fields.tags.split(',').map(x => x.trim());
    }
    return ArticleList.insert(fields);
  },

  updateArticle(selectedArticleID, argFields) {
    check(selectedArticleID, String);
    check(argFields, Object);

    const fields = { ...argFields };

    if (fields.pages && typeof fields.pages === 'string') {
      fields.pages = fields.pages.split(',').map(x => x.trim());
    }
    if (fields.tags && typeof fields.tags === 'string') {
      fields.tags = fields.tags.split(',').map(x => x.trim());
    }
    return ArticleList.update({ _id: selectedArticleID }, fields);
  },
  removeArticle(selectedArticle) {
    check(selectedArticle, String);
    return ArticleList.remove(selectedArticle);
  },
});
