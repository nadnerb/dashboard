define([
    'backbone',
    'views/performance-server-view',
    'views/performance-charts-view'
], function (Backbone, ServerView, ChartsView) {
    return Backbone.SuperView.extend({

        id: 'newrelic',

        initialize: function () {
          this.serverView = new ServerView();
          this.chartsView = new ChartsView();
        },

        postRender: function () {
          this.$el.append(this.serverView.render().el);
          this.$el.append(this.chartsView.render().el);
        },

        destroy: function () {
          this.serverView.destroy();
          this.chartsView.destroy();
          Backbone.SuperView.prototype.destroy.call(this);
        }

    });
});
