define([
    'collections/newrelic-charts',
    'views/widget-view',
    'text!templates/configure-newrelic-charts.html.haml',
    'text!templates/add-newrelic-chart.html.haml'
], function (PerformanceCharts, WidgetView, configureTemplateCharts, addChartModalTemplate) {
    return WidgetView.extend({

        id: 'performance',

        events: {
            'click .add-new-chart': 'addNewChart',
            'click #add-chart-modal .confirm': 'confirmAddChart',
            'click li .controls .btn': 'deleteChart'
        },

        initialize: function () {
          this.options = {
              heading: 'Performance Charts',
              contentId: 'performance-charts-widget'
          };
          WidgetView.prototype.initialize.call(this, this.options);
          this.performanceModel = new PerformanceCharts();
          this.performanceModel.on('reset', function () {
            this.render();
          }, this).on('destroy', function () {
            if (!this.performanceModel.length) {
              this.append(haml.compileHaml({source: configureTemplateCharts})());
            }
          }, this);
          this.performanceModel.fetch();
        },

        postRender: function () {
          WidgetView.prototype.postRender.call(this);
          this.renderControls();
          if (!this.performanceModel.length) {
            this.append(haml.compileHaml({source: configureTemplateCharts})());
          } else {
            this.$('.widget-content').html('<ul class="thumbnails"></ul>');
            this.performanceModel.each(function (chart) {
              this.$('ul.thumbnails').append(this.renderChart(chart));
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
          } else {
            this.$('#iframe').removeClass('error');
            this.$('#iframe .help-block').html('');
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
                this.$('#iframe .help-block').html(JSON.parse(response.responseText).join(', '));
              },
              success: function (model, response) {
                $('#add-chart-modal').modal('hide');
                if (_this.performanceModel.length == 1) {
                  _this.$('.widget-content').html('<ul class="thumbnails"></ul>');
                }
                _this.$('ul.thumbnails').append(_this.renderChart(model));
              }
            });
          }
        },

        deleteChart: function (event) {
          event.preventDefault();
          var id = $(event.currentTarget).data('id');
          var chart = this.performanceModel.get(id);
          chart.destroy();
          $('#chart-' + id).detach();
        },

        renderChart: function (chart) {
          return '<li id="chart-' + chart.id +
            '"><div class="controls pull-right"><a href="#" class="btn btn-mini" data-id="' + chart.id +
            '"><i class="icon-remove"></i></a></div>' +
            chart.get('source') + '</li>';
        }

    });
});
