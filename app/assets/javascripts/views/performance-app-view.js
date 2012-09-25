define([
    'vendor/base',
    'models/performance',
    'views/widget-view',
    'text!templates/configure-newrelic.html.haml',
    'text!templates/performance.html.haml'
], function (BackboneSuperView, Performance, WidgetView, configureTemplate, performanceTemplate) {
    return BackboneSuperView.extend({

        id: 'performance',

        events: {
            'click .btn': 'configure',
            'click .killmenow': 'deleteConfig'
        },

        initialize: function (options) {
          this.createModel();
        },

        postRender: function () {
            if (this.model.has('source')) {
                this.renderMetrics();
            } else {
                this.renderConfigureNewRelic();
            }
        },

        renderConfigureNewRelic: function () {
            var view = new WidgetView({
               heading: 'Configure New Relic',
               contentId: 'configure-newrelic-widget'
            }).render();

            if (this.model.has('not_configured')) {
              view.appendTemplate(configureTemplate);
            } else {
              view.append('Loading...');
            }

            this.$el.html(view.el);
        },

        configure: function () {
            var iframe = this.$('#newrelic-iframe').val();

            this.model.on('error', function (model, errors) {
                _(errors).each(function (error) {
                    this.$('#' + error.name).addClass('error');
                    this.$('#' + error.name + ' .help-inline').text(error.message);
                }, this);
            }, this);

            this.$('.control-group').removeClass('error');
            this.$('.help-inline').empty();

            this.model.save({
                not_configured: undefined,
                invalid: undefined,
                iframe: iframe,
            });

            return false;
        },

        renderMetrics: function () {
          var view = new WidgetView({
            heading: 'New Relic',
            contentId: 'newrelic-widget'
          }).render();

          if(!this.model.get('invalid')) {
            view.append('<iframe src="' + this.model.get('source') + '" width="850" height="300" scrolling="no" frameborder="no"></iframe>');
            view.append('<div><a class="killmenow" href="#">Change Graph</a></div>');
            this.$el.html(view.el);
          }
        },

        deleteConfig: function (e) {
          e.preventDefault();
          this.model.destroy();
          this.createModel();
          this.model.fetch();
        },

        createModel: function() {
          this.model = new Performance();
          this.model.on('change', function () {
            this.render();
          }, this);
        }

    });
});
