require.config({
    baseUrl: 'assets',
    paths: {
        jquery: 'libs/jquery-1.7.2',
        underscore: 'libs/underscore',
        backbone: 'libs/backbone',
        'underscore.string': 'libs/underscore.string',
        text: 'libs/text',
        templates: 'templates'
    },

    shim: {
        "backbone": {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },

        'underscore': {
            exports: '_'
        },

        'underscore.string': ["underscore"],
        'libs/bootstrap': ["jquery"],
        'libs/jquery.cookie': ["jquery"],
        'libs/jquery.githubRepoWidget': ["jquery"],
        'libs/base': ['backbone']
    }
});

require([
    'underscore',
    'underscore.string'
], function(_, _string) {
    _.mixin(_string.exports());
});

require([
    'jquery',
    'backbone',
    'routers/app-router',
    'libs/backbone.superview'
], function($, Backbone, AppRouter) {
    $(function() {
        router = new AppRouter();
        Backbone.history.start();
    });
});