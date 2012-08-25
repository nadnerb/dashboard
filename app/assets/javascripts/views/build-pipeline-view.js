define([
    'vendor/base',
    'views/build-view',
], function (BackboneSuperView, BuildView) {

    return BackboneSuperView.extend({

        className: 'build-pipeline span5',

        builds: [],

        initialize: function () {
            this.collection.on('reset', function () {
                this.collection.pipeline();
                this.updateBuilds();
            }, this);
        },

        updateBuilds: function () {
            if (this.builds.length === 0) {
                this.appendBuilds();
            } else {
                this.refreshBuilds();
            }
        },

        refreshBuilds: function () {
            var count = 0;
            var build = this.collection.firstInPipeline;
            this.builds[count].update(build);

            count++;
            while (build.hasNext()) {
                this.builds[count].update(build.next);
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
            this.builds.push(buildView);
            this.$el.append(buildView.el);
            buildView.renderSpinner();
        }
    });
});