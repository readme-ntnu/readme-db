Router.configure({
    notFoundTemplate: 'search',
    layoutTemplate: 'layout'
});

Router.route('/admin', function() {
    this.render('admin');
});

Router.route('/:keywords', function() {
    this.render('search');
    Session.set('searchText', this.params.keywords);
});
