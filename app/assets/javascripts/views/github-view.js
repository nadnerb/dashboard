define([
    'vendor/base',
    'collections/newrelic-charts',
    'views/widget-view',
    'text!templates/github.html.haml'
    ], function (BackboneSuperView, PerformanceCharts, WidgetView, template) {
      return BackboneSuperView.extend({

      id: 'github-view',

      className: 'row',

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
          heading: 'Latest Commits',
          contentId: 'github-widget'
        }).render();
        this.githubView.append("<div class='github-widget-container' data-repo='" + githubUser + "/" + githubProject + "'>");
        this.githubView.append('<div id="loading-github"></div>');
        this.$('.github-widget').append(this.githubView.el);
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
        }
    });

  });
