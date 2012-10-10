define([
    'jquery',
    'backbone',
    'views/dashboard-view',
    'views/index-view',
    'views/github-view',
    'views/performance-view',
    'views/configure-view',
    'views/stories-view',
    'views/builds-view'
], function ($, Backbone, DashboardView, IndexView, GithubView, PerformanceView, ConfigureView, StoriesView, BuildsView) {
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
            var view = new IndexView();
            this.dashboard.apply(view);

            var github = new GithubView();
            this.dashboard.add(github);

            github.github();
        },

        performance: function () {
            var view = new PerformanceView();
            this.dashboard.apply(view);
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
