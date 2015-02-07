Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/', {
    name: 'archive'
});

Router.route('/db', {
    name: 'search'
});

Router.route('/admin', {
    name: 'admin'
});
