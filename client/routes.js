Router.map(function() {
    this.route('battleForm', {
        path: '/'
    })
    this.route('battleOutcome')
    this.route('battleStats')
});

Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading',
});