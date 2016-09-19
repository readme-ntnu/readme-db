import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import Helpers from '../helpers/helpers';
import Defaults from '../helpers/defaults';
import ArticleConfig from '../config/articles-config';
import ArticleList from '../../lib/ArticleList';
import debounce from '../../lib/debounce';
/* global sAlert, Confirmation */

Template.search.events({
  'click th'(event) {
    const newVal = event.target.id.substring(3);
    Session.set('sortAscending', (Session.get('sortByColumn') !== newVal)
      ? true
      : !Session.get('sortAscending'));
    Session.set('sortByColumn', newVal);
  },
  'click #remove'() {
    if (!this._id || !Helpers.checkConnectionStatus()) return;
    const article = this;
    new Confirmation(Defaults.removalConfirmation(article), (ok) => {
            // ok is true if the user clicked on "ok", false otherwise
      if (!ok) return;
      Meteor.call('removeArticle', article._id, (error) => {
        if (error) sAlert.error(Defaults.errorMessageFromServer);
        else sAlert.success(`"${article.title}" ble fjernet.`);
      });
    });
  },
  'click td'() {
    Session.set('selectedArticle', this._id);
  },
  'keyup [type=text]'(event) {
    debounce(() => { Session.set('searchText', event.target.value); }, 400)();
  },
    // Is called when a table cell that is being edited loses focus.
  'blur td'(event) {
    // Example className: 'td-title'. Example articleFieldName: 'title'
    const articleFieldName = event.target.className.substring(3);

    const oldVal = this[articleFieldName];
    let newVal = event.target.innerText.trim();
    const article = this;


    // If there's no change, user not logged in, or the cell clicked is the remove button,
    // do nothing.
    if (newVal === oldVal || !Meteor.user() || articleFieldName === 'remove') return;

    // If the field being edited is empty and the field is mandatory,
    // display error message and don't update.
    if (!newVal && ArticleConfig.mandatoryProperties.includes(articleFieldName)) {
      sAlert.error('Feltet kan ikke være tomt.');
      return;
    }

    // If the field is containing an array, split the newVal into an array and compare.
    // If no change, do nothing.
    const arrayFields = ['pages', 'tags'];
    if (typeof oldVal !== 'string' || arrayFields.includes(articleFieldName)) {
      newVal = newVal.split(',').map(x => x.trim());
      if (Helpers.equalsArray(oldVal, newVal)) return;
    }

    const inner = {};
    inner[articleFieldName] = newVal;

    // If edition or pages is changed, remember to also update url
    if (articleFieldName === 'edition') {
      inner.url = Helpers.getUrlFromEdition(newVal, article.pages);
      event.target.innerHTML = `<a href="${inner.url}">${newVal}</a>`;
    } else if (articleFieldName === 'pages') {
      inner.url = Helpers.getUrlFromEdition(article.edition, newVal);
      event.target.innerText = '';
    } else {
      event.target.innerText = '';
    }
    Meteor.call('updateArticle', article._id, { $set: inner }, (error) => {
      if (error) {
        sAlert.error(Defaults.errorMessageFromServer);
      } else {
        sAlert.success(`"${article.title}" ble endret. ("${oldVal}" --> "${newVal}")`);
      }
    });
  },
});

Template.search.helpers({
  loggedIn() {
    return !!Meteor.user();
  },

  // Updates URL without loading page.
  // Makes sure the search text field's value equals the searchText variable.
  searchText() {
    if (!Session.get('searchText') || Session.get('searchText').trim().length <= 0) {
      history.pushState({}, '', '/');
      return '';
    }
    history.pushState({}, '', Session.get('searchText'));
    return Session.get('searchText');
  },

  article() {
    let resultArray;

    // If search field is empty, show all
    if (!Session.get('searchText') || !Session.get('searchText').trim()) {
      resultArray = ArticleList.search('').fetch();
    } else {
      // Array of all space-separated keywords
      const keywords = Session.get('searchText').trim().split(' ');

      // Search for each keyword and intersect with resultArray to find articles present in all
      resultArray = ArticleList.search(keywords[0].trim()).fetch();
      for (let i = 1; i < keywords.length; i++) {
        const keyWord = keywords[i].trim();
        resultArray = Helpers.intersect(resultArray, ArticleList.search(keyWord).fetch());
      }
    }

    // Sort by column property
    const sortProp = Session.get('sortByColumn');
    if (!sortProp) return resultArray;

    resultArray.sort((a, b) => {
      const order = Session.get('sortAscending') ? 1 : -1;
      if (a[sortProp] < b[sortProp]) return -1 * order;
      if (a[sortProp] > b[sortProp]) return order;
      return 0;
    });
    return resultArray;
  },
});
