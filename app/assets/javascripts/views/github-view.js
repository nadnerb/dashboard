define([
    'vendor/base',
    'collections/newrelic-charts',
    'views/widget-view',
    'text!templates/github.html.haml'
    ], function (BackboneSuperView, PerformanceCharts, WidgetView, template) {
      return BackboneSuperView.extend({

      id: 'github-view',

      template: template,

      initialize: function (options) {
        this.performanceModel = new PerformanceCharts();
        this.performanceModel.on('reset', function () {
          this.renderPerformanceChart();
        }, this);
      },

      postRender: function () {
        this.performanceView = new WidgetView({
         heading: 'Performance',
         contentId: 'performance-widget'
        }).render();
        this.$('.performance-widget').append(this.performanceView.el);
        this.performanceModel.fetch();

        this.githubView = new WidgetView({
          heading: 'Github',
        contentId: 'github-widget'
        }).render();
        this.githubView.append("<div class='github-widget-container' data-repo='" + githubUser + "/" + githubProject + "'>");
        this.githubView.append('<div id="loading-github"></div>');
        this.$('.github-widget').append(this.githubView.el);
      },

      spinner: function () {
        if (this.githubView.$('#loading-github svg').length === 0) {
          spinner('loading-github', 50, 45, 15, 3, '#888');
        } else {
          this.$('#loading-github').empty();
        }
      },

      renderPerformanceChart: function () {
        if (this.performanceModel.size() > 0) {
          this.performanceView.append(this.renderChart(this.performanceModel.first()));
        } else {
          this.performanceView.append('New Relic needs to be configured from the Performance Tab. The first graph added will appear here.');
        }
      },

      github: function() {
        githubWidget();
      },

      renderChart: function (chart) {
        return chart.get('source');
          // return '<li id="chart-' + chart.id +
          //   '"><div class="controls pull-right"><a href="#" class="btn btn-mini" data-id="' + chart.id +
          //   '"><i class="icon-remove"></i></a></div>' +
          //   chart.get('source') + '</li>';
        }
    });

  });
