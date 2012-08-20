define([
    'vendor/base',
    'collections/builds',
    'views/widget-view',
    'text!templates/builds.html.haml'
], function (BackboneSuperView, BuildsCollection, WidgetView, template) {
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
            });
            view.render();
            this.$el.append(view.el);

            if (this.collection.isEmpty()) {
                view.content('Negotiating with Jenkins...');
            } else {
                var build = this.collection.firstInPipeline;
                var html = [];
                html.push(this.renderBuild(build));

                while (build.hasNext()) {
                    html.push(this.renderBuild(build.next));
                    build = build.next;
                }

                view.content(html.join(''));

                var self = this;
                setTimeout(function () {
                    self.collection.fetch();
                }, 6000);
            }
        },

        renderBuild: function (build) {
            return '<div class="build build-' + build.get('color') + '">' +
                '<div class="rotation">' + 
                '</div></div>' +
                '<span class="heading">' + build.get('displayName') + '</span>';
        }
    });
});