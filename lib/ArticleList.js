import { Meteor } from 'meteor/meteor';

const ArticleList = new Meteor.Collection('articles');

ArticleList.search = (query) => {
  const q = query ? query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') : '';
  return ArticleList.find({
    $or: [
            { edition: { $regex: q, $options: 'i' } },
            { pages: { $regex: q, $options: 'i' } },
            { title: { $regex: q, $options: 'i' } },
            { author: { $regex: q, $options: 'i' } },
            { layout: { $regex: q, $options: 'i' } },
            { type: { $regex: q, $options: 'i' } },
            { tags: { $regex: q, $options: 'i' } },
    ] });
};

export default ArticleList;
