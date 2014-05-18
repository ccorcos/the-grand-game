Router.map(function() {
    this.route('battle', {
        path: '/'
    })
    this.route('home')
    this.route('politics')
    this.route('random')
});

Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading',
});