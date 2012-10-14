define([
    'libs/base',
    'views/performance-server-view',
    'views/performance-charts-view'
], function (BackboneSuperView, ServerView, ChartsView) {
    return BackboneSuperView.extend({

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
          BackboneSuperView.prototype.destroy.call(this);
        }

    });
});
