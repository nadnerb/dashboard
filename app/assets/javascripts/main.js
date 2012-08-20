require.config({
    baseUrl: 'assets',
    paths: {
        jquery: 'vendor/jquery-1.7.2',
        underscore: 'vendor/underscore',
        backbone: 'vendor/backbone',
        'underscore.string': 'vendor/underscore.string',
        text: 'vendor/text',
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

        'underscore.string': {
              deps: ["underscore"],
              exports: '_.string'
        },

        'vendor/bootstrap': ["jquery"],

        'vendor/jquery.cookie': ["jquery"],

        'vendor/base': ['backbone']
    }
});

require([
    'underscore',
    'underscore.string'], function(_, _string) {
        _.mixin(_string.exports());
});

require([
  'jquery',
  'backbone',
  'routers/app-router',
  'vendor/base',
  'vendor/bootstrap',
  'vendor/haml',
  'vendor/jquery.cookie'
], function($, Backbone, AppRouter) {
    $(function() {
        router = new AppRouter();
        Backbone.history.start();
    });
});