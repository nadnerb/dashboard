define([
    'collections/builds',
    'views/widget-view',
    'views/build-view',
], function (BuildsCollection, WidgetView, BuildView) {
    return WidgetView.extend({

        className: 'builds',

        builds: [],

        initialize: function (options) {
            WidgetView.prototype.initialize.call(this, options);

            this.collection = new BuildsCollection();
            this.collection.on('reset', function () {
                this.collection.pipeline();
                this.render();
            }, this);
        },

        postRender: function () {
            WidgetView.prototype.postRender.call(this);

            if (this.collection.isEmpty()) {
                this.append('Negotiating with Jenkins...');
                return;
            }

            this.appendBuilds(this.collection);
            this.checkPeriodically();
        },

        appendBuilds: function (builds) {
            var build = builds.firstInPipeline;
            this.appendBuild(build);

            while (build.hasNext()) {
                this.appendBuild(build.next);
                build = build.next;
            }
        },

        appendBuild: function (build) {
            var buildView = new BuildView({model: build}).render();
            this.builds.push(buildView);
            this.append(buildView.el);
            buildView.renderSpinner();
        },

        checkPeriodically: function () {
            var self = this;
            setTimeout(function () {
                self.collection.fetch();
            }, 5000);
        }
    });
});