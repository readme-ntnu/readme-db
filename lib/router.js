Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/', {
    name: 'search'
});

Router.route('/admin', {
    name: 'admin'
});
