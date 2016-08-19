import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import Helpers from '../helpers/helpers';
import Defaults from '../helpers/defaults';
import ArticleConfig from '../config/articles-config';
import ArticleList from '../../lib/ArticleList';
/* global sAlert */

// Returns the Admin form values as an object which reflects an article
const getFormFields = (template) => {
  const fields = {
    edition: template.find('#addEdition').value,
    pages: template.find('#addPages').value.split(','),
    title: template.find('#addTitle').value,
    author: template.find('#addAuthor').value,
    layout: template.find('#addLayout').value,
    type: template.find('#addType').value,
    tags: template.find('#addTags').value.split(','),
  };
  fields.url = Helpers.getUrlFromEdition(fields.edition, fields.pages);
  return fields;
};

// Checks if form is filled out properly. Warns user if it is not.
const formIsOK = (template) => {
  const formFields = getFormFields(template);
  const mandatory = {
    Utgave: formFields.edition.trim(),
    Sidetall: formFields.pages.filter(x => x.trim().length > 0),
    Tittel: formFields.title.trim(),
  };
  let ok = true;
  Object.keys(mandatory).forEach((key) => {
    const value = mandatory[key];
    if (!value || value.length < 1) {
      sAlert.error(`${key} mangler.`);
      ok = false;
    }
  });
  return ok;
};

// Checks if an article already exists at given page in given edition. Warns user if true.
const articleAlreadyExists = (edition, pages, title) => {
  const articleExists = ArticleList.find({
    edition,
    pages: { $in: pages },
    title,
  }).count() > 0;
  if (articleExists) {
    sAlert.error('Denne artikkelen finnes allerede.');
  }
  return articleExists;
};

Template.admin.events({
  'click #new': (event, templateInstance) => {
    if (!Helpers.checkConnectionStatus()) return;
    event.preventDefault();
    const fields = getFormFields(templateInstance);
    if (!formIsOK(templateInstance)
      || articleAlreadyExists(fields.edition, fields.pages, fields.title)) {
      return;
    }
    Meteor.call('insertArticle', fields, (error, result) => {
      if (error) {
        sAlert.error(Defaults.errorMessageFromServer);
        return;
      }
      Session.set('selectedArticle', result);
      sAlert.success(`Artikkel "${fields.title}" ble lagt til.`);
    });

        // Make it easier to continue with next article
    templateInstance.find('#addPages').focus();
    const nextPage = String(Number(fields.pages[fields.pages.length - 1]) + 1);
    templateInstance.find('#addPages').value = nextPage;
    templateInstance.find('#addType').value = ArticleConfig.types[nextPage] || '';
  },
  'click #edit': (event, templateInstance) => {
    if (!Helpers.checkConnectionStatus()) return;
    event.preventDefault();
    if (formIsOK(templateInstance)) {
      const title = templateInstance.find('#addTitle').value;
      Meteor.call(
        'updateArticle',
        Session.get('selectedArticle'),
        getFormFields(templateInstance),
        (error) => {
          if (error) sAlert.error(Defaults.errorMessageFromServer);
          else sAlert.success(`Artikkel "${title}" ble endret.`);
        });
    }
  },
  'click #remove': (event, templateInstance) => {
    if (!Helpers.checkConnectionStatus()) return;
    const title = templateInstance.find('#addTitle').value;
    Meteor.call('removeArticle', Session.get('selectedArticle'), (error) => {
      if (error) {
        sAlert.error(Defaults.errorMessageFromServer);
        return;
      }
      sAlert.success(`Artikkel "${title}" ble slettet.`);
      Session.set('selectedArticle', null);
    });
  },
});

Template.admin.helpers({
  noArticleSelected() {
    return !Session.get('selectedArticle');
  },
});
