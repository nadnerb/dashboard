define([
    'vendor/base',
    'models/iteration',
    'views/widget-view',
    'text!templates/stories.html.haml'
], function (BackboneSuperView, Iteration, WidgetView, template) {
    return BackboneSuperView.extend({

        id: 'stories',

        template: template,

        initialize: function (options) {
            this.model = new Iteration();
            this.model.on('change', function () {
                this.render();
            }, this);
        },

        postRender: function () {
          var view = new WidgetView({
            heading: 'Burn Down Chart',
            contentId: 'burn-down-widget'
          });
          view.render();
          this.$el.html(view.el);

          if (this.model.hasChanged()) {
              renderLineGraph({
                elementId: view.options.contentId,
                labels: this.model.burnDownDates(),
                values: this.model.burnDownValues(),
                width: Math.min(this.$el.width(), 900),
                height: 250
              });
          } else {
                view.append('Pivotal Tracker Chatter happening...');
          }
        }
    });
});