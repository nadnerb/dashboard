define([
    'vendor/base',
    'models/performance',
    'views/widget-view',
    'text!templates/configure-newrelic-charts.html.haml',
    'text!templates/performance-charts.html.haml'
], function (BackboneSuperView, PerformanceCharts, WidgetView, configureTemplate, performanceTemplate) {
    return WidgetView.extend({

        id: 'performance',

        events: {
            'click .add-new-chart': 'addNewChart'
        },

        initialize: function (options) {
          WidgetView.prototype.initialize.call(this, {
              heading: 'Performance Charts',
              contentId: 'performance-charts-widget'
          });
          this.performanceModel = new PerformanceCharts();
          this.performanceModel.on('change', function () {
            this.render();
          }, this);
        },

        postRender: function () {
          WidgetView.prototype.postRender.call(this);
          this.renderControls();
          this.append(haml.compileHaml({source: configureTemplate})());
        },

        renderControls: function () {
          this.$('.widget-header h3').append('<div class="widget-toolbar"><a id="add-new-chart-btn" class="btn add-new-chart" href="#" rel="tooltip" title="Add a new chart"><i class="icon-plus"/></a></div>');
        },

        addNewChart: function (event) {
          event.preventDefault();
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
        }

    });
});
