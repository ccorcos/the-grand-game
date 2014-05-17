Router.map(function() {
    this.route('battleForm', {
        path: '/'
    })
    this.route('battleOutcome')
    this.route('battleStats')
    this.route('home')
});

Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading',
});