define([
    'vendor/base',
    'collections/builds',
    'views/widget-view',
    'views/build-view',
    'text!templates/builds.html.haml'
], function (BackboneSuperView, BuildsCollection, WidgetView, BuildView, template) {
    return BackboneSuperView.extend({

        className: 'builds',

        template: template,

        initialize: function () {
            this.collection = new BuildsCollection();
            this.collection.on('reset', function () {
                this.collection.pipeline();
                this.render();
            }, this);
        },

        postRender: function () {
            var view = new WidgetView({
                heading: 'Build Pipeline',
                contentId: 'build-pipeline-widget'
            }).render();
            this.$el.append(view.el);

            if (this.collection.isEmpty()) {
                view.append('Negotiating with Jenkins...');
                return;
            }

            this.appendAll(view, this.collection);
            // this.checkPeriodically();
        },

        appendAll: function (view, builds) {
            var build = builds.firstInPipeline;
            this.append(view, build);

            while (build.hasNext()) {
                this.append(view, build.next);
                build = build.next;
            }
        },

        append: function (view, build) {
            var buildView = new BuildView({model: build}).render();
            view.append(buildView.el);
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