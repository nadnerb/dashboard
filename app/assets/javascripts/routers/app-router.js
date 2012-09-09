define([
    'jquery',
    'backbone',
    'views/dashboard-view',
    'views/index-view',
    'views/performance-view',
    'views/configure-view',
    'views/stories-view',
    'views/builds-view'
], function ($, Backbone, DashboardView, IndexView, PerformanceView, ConfigureView, StoriesView, BuildsView) {
    return Backbone.Router.extend({

        routes: {
            '': 'default',
            ':action': 'nav'
        },

        dashboard: null,

        initialize: function () {
            this.dashboard = new DashboardView();
            this.dashboard.render();
            $('body').append(this.dashboard.el);
        },

        default: function () {
            this.nav('index');
        },

        nav: function (action) {
            this[action]();
        },

        builds: function () {
            var view = new BuildsView({
                heading: 'Build Pipeline',
                contentId: 'build-pipeline-widget'
            });
            this.dashboard.apply(view);
        },

        index: function () {
            this.dashboard.apply(new IndexView());
        },

        performance: function () {
            var view = new PerformanceView();
            this.dashboard.apply(view);
            view.model.fetch();
        },

        configure: function () {
            var view = new ConfigureView();
            this.dashboard.apply(view)
            view.availableCollection.fetch();
        },

        stories: function () {
            var view = new StoriesView();
            this.dashboard.apply(view);
            view.model.fetch();
        }
    });
});
