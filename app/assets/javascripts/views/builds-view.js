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
                this.renderCollection();
            }, this);
        },

        postRender: function () {
            WidgetView.prototype.postRender.call(this);
            this.append('Negotiating with Jenkins...');
        },

        renderCollection: function () {
            if (this.builds.length > 0) {
                this.refreshBuilds(this.collection);
            } else {
                this.empty();
                this.appendBuilds(this.collection);
            }

            this.checkPeriodically();
        },

        refreshBuilds: function (builds) {
            var count = 0;
            var build = builds.firstInPipeline;
            this.builds[count].update(build);

            count++;
            while (build.hasNext()) {
                this.builds[count].update(build.next);
                build = build.next;
                count++;
            }
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