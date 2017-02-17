import ArticleList from '../../../lib/ArticleList';
import Helpers from '../../../lib/helpers/helpers';

const search = {
  get() {
    const query = this.queryParams.q || '';
    // Array of all space-separated keywords
    const keywords = query.trim().split(' ');

    // Search for each keyword and intersect with resultArray to find articles present in all
    const articles = keywords
      .map(keyword => ArticleList.search(keyword.trim()).fetch())
      .reduce(Helpers.intersect);

    return {
      headers: {
        'Content-Type': 'application/json',
      },
      body: articles,
    };
  },
};

export default search;
