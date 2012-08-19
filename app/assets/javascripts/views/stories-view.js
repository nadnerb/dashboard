define([
    'jquery',
    'vendor/base',
    'models/iteration',
    'text!templates/stories.html.haml'
], function ($, BackboneSuperView, Iteration, template) {
    return BackboneSuperView.extend({

        id: 'stories',

        template: template,

        initialize: function (options) {
            this.model = new Iteration();
            this.model.on('change', function () {
                this.render();
                this.renderImages();
            }, this);
        },

        postRender: function () {
          this.$el.html('Pivotal Tracker Chatter happening...');
        },

        renderImages: function () {
            this.$el.empty();
            renderLineGraph({
              elementId: this.id,
              labels: this.model.burnDownDates(),
              values: this.model.burnDownValues(),
              width: Math.min(this.$el.width(), 900),
              height: 250
            });
        }
    });
});