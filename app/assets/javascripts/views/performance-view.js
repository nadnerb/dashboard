define([
    'vendor/base',
    'views/performance-server-view',
    'views/performance-app-view'
], function (BackboneSuperView, ServerView, AppView) {
    return BackboneSuperView.extend({

        id: 'newrelic',

        initialize: function (options) {
          //var serverView = new ServerView(this, this.model);
          var appView = new AppView(this, this.model);
          appView.model.fetch();
        },

        postRender: function () {
        }

    });
});
