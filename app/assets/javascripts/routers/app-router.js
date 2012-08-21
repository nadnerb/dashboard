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
            }).render();
            this.dashboard.apply(view);
            view.collection.fetch();
        },

        index: function () {
            this.dashboard.apply(new IndexView().render());
        },

        performance: function () {
            this.dashboard.apply(new PerformanceView().render());
        },

        configure: function () {
            this.dashboard.apply(new ConfigureView().render());
        },

        stories: function () {
            var view = new StoriesView().render();
            this.dashboard.apply(view);
            view.model.fetch();
        }
    });
});