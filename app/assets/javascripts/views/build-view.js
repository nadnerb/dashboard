define([
    'vendor/base',
    'collections/builds',
    'text!templates/builds.html.haml'
], function (BackboneSuperView, BuildsCollection, template) {
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
            if (this.collection.isEmpty()) {
                this.$('.build-pipeline').html('Negotiating with Jenkins...');
            } else {
                var build = this.collection.firstInPipeline;
                var html = [];
                html.push(this.renderBuild(build));

                while (build.hasNext()) {
                    html.push(this.renderBuild(build.next));
                    build = build.next;
                }

                this.$('.build-pipeline').html(html.join(''));

                var self = this;
                setTimeout(function () {
                    self.collection.fetch();
                }, 5000);
            }   
        },

        renderBuild: function (build) {
            return build.get('displayName') + '<div class="build build-' + build.get('color') + '">' + 
                    '</div>';
        }
    });
});