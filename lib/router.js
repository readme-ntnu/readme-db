import { Session } from 'meteor/session';
/* global Router */

Router.configure({
  notFoundTemplate: 'search',
  layoutTemplate: 'layout',
  trackPageView: true,
});

Router.route('/admin', function routeAdmin() {
  this.render('admin');
});

Router.route('/:keywords', function routeSearch() {
  this.render('search');
  Session.set('searchText', this.params.keywords);
});
