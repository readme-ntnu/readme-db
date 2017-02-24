import ArticleList from '../../../lib/ArticleList';
import Helpers from '../../../lib/helpers/helpers';

const slack = {
  post() {
    const query = this.bodyParams.text || '';
    // Array of all space-separated keywords
    const keywords = query.trim().split(' ');

    // The url corresponding to this search on arkiv.abakus.no
    const url = `http://arkiv.abakus.no/${query.trim().replace(/\s/g, '+')}`;

    // Search for each keyword and intersect with resultArray to find articles present in all
    const articles = keywords
      .map(keyword => ArticleList.search(keyword.trim()).fetch())
      .reduce(Helpers.intersect);

    const body = {
      text: `Søk etter *${query}* gir følgende artikler: ${url}`,
      response_type: 'in_channel',
      attachments: articles.slice(0, 10).map(a => (
        {
          title: a.title,
          title_link: Helpers.getUrlFromEdition(a.edition, a.pages),
          text: `Utgave ${a.edition} side ${a.pages}`,
        })),
    };

    return {
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    };
  },
};

export default slack;
