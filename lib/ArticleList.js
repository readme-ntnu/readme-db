import { Meteor } from 'meteor/meteor';

const ArticleList = new Meteor.Collection('articles');

if (Meteor.isServer) {
  ArticleList._ensureIndex({
    edition: 'text',
    pages: 'text',
    title: 'text',
    author: 'text',
    layout: 'text',
    photo: 'text',
    type: 'text',
    tags: 'text',
    content: 'text',
  }, {
    weights: {
      type: 3,
      tags: 5,
      title: 10,
      author: 8,
      layout: 8,
      photo: 8,
    },
  });
}

export default ArticleList;
