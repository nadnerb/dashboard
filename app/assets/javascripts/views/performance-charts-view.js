define([
    'vendor/base',
    'collections/newrelic-charts',
    'views/widget-view',
    'text!templates/configure-newrelic-charts.html.haml',
    'text!templates/add-newrelic-chart.html.haml'
], function (BackboneSuperView, PerformanceCharts, WidgetView, configureTemplateCharts, addChartModalTemplate) {
    return WidgetView.extend({

        id: 'performance',

        events: {
            'click .add-new-chart': 'addNewChart',
            'click #add-chart-modal .confirm': 'confirmAddChart'
        },

        initialize: function (options) {
          WidgetView.prototype.initialize.call(this, {
              heading: 'Performance Charts',
              contentId: 'performance-charts-widget'
          });
          this.performanceModel = new PerformanceCharts();
          this.performanceModel.on('change reset', function () {
            this.render();
          }, this);
          this.performanceModel.fetch();
        },

        postRender: function () {
          WidgetView.prototype.postRender.call(this);
          this.renderControls();
          if (!this.performanceModel.length) {
            this.append(haml.compileHaml({source: configureTemplateCharts})());
          } else {
            this.performanceModel.each(function (chart) {
              this.append(chart.get('source'));
            }, this);
          }
        },

        renderControls: function () {
          this.$('.widget-header h3').append('<div class="widget-toolbar"><a id="add-new-chart-btn" class="btn add-new-chart" href="#" rel="tooltip" title="Add a new chart"><i class="icon-plus"/></a></div>');
        },

        addNewChart: function (event) {
          event.preventDefault();
          if (!this.$('#add-chart-modal').length) {
            this.$el.append(haml.compileHaml({source: addChartModalTemplate})());
          }
          this.$('#iframe textarea').val('');
          $('#add-chart-modal').modal();
        },

        confirmAddChart: function (event) {
          event.preventDefault();
          this.$('#iframe').removeClass('error');
          this.$('#iframe .help-block').html('');
          var iframe = this.$('#iframe textarea').val();
          if (!iframe) {
            this.$('#iframe').addClass('error');
            this.$('#iframe .help-block').html('IFRAME source is required');
          } else {
            this.performanceModel.create({source: iframe}, {
              error: function (model, response) {
                this.$('#iframe').addClass('error');
                console.log(response);
                this.$('#iframe .help-block').html(JSON.parse(response.responseText).join(', '));
              },
              success: function (model, response) {
                $('#add-chart-modal').modal('hide');
              }
            });
          }
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
