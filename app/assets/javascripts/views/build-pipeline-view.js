define([
    'backbone',
    'views/build-view',
], function (Backbone, BuildView) {

    return Backbone.SuperView.extend({

        className: 'build-pipeline span5',

        views: [],

        initialize: function () {
            this.views = [];
            this.bindTo(this.collection, 'reset', function () {
                this.collection.pipeline();
                this.updateBuilds();
            });
        },

        updateBuilds: function () {
            if (this.views.length === 0) {
                this.appendBuilds();
            } else {
                this.refreshBuilds();
            }
        },

        refreshBuilds: function () {
            var count = 0;
            var build = this.collection.firstInPipeline;
            this.views[count].update(build);

            count++;
            while (build.hasNext()) {
                this.views[count].update(build.next);
                build = build.next;
                count++;
            }
        },

        appendBuilds: function () {
            var build = this.collection.firstInPipeline;
            this.appendBuild(build);

            while (build.hasNext()) {
                this.appendBuild(build.next);
                build = build.next;
            }
        },

        appendBuild: function (build) {
            var buildView = new BuildView({model: build}).render();
            this.views.push(buildView);
            this.$el.append(buildView.el);
            buildView.renderSpinner();
        },

        destroy: function () {
            Backbone.SuperView.prototype.destroy.call(this);
            _(this.views).each(function (view) {
                view.destroy();
            });
        }
    });
});