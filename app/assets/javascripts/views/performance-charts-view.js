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
          this.performanceModel.on('reset', function () {
            this.$('widget-content').html('');
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
            var _this = this;
            this.performanceModel.create({source: iframe}, {
              error: function (model, response) {
                this.$('#iframe').addClass('error');
                console.log(response);
                this.$('#iframe .help-block').html(JSON.parse(response.responseText).join(', '));
              },
              success: function (model, response) {
                $('#add-chart-modal').modal('hide');
                _this.append(model.get('source'));
              }
            });
          }
        }

    });
});
