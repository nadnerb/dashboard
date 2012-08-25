define([
    'vendor/base',
    'models/last-successful',
    'text!templates/build-information.html.haml'
], function (BackboneSuperView, LastSuccessful, template) {

    return BackboneSuperView.extend({

        className: 'build-information span7',

        template: template,

        initialize: function () {
            var onReset = function () {
                this.render();
                this.collection.off('reset', onReset);
            };

            this.collection.on('reset', onReset, this);
        },

        postRender: function () {
            if (this.collection.isEmpty()) {
                return;
            }

            this.renderCommitBuild();
            this.renderProductionBuild();            
        },

        renderCommitBuild: function () {
            var canCommit = this.collection.all(function (build) {
                return build.canCommit();
            });

            if (canCommit) {
                this.$('.commit-build').html('Push like you\'ve never pushed before!');
            } else {
                this.$('.commit-build').html('Nope, you cannot push right now.');
            }
        },

        renderProductionBuild: function () {
            var productionBuild = this.collection.find(function (build) {
                return build.isProductionBuild();
            });

            var lastSuccessful = new LastSuccessful({displayName: productionBuild.get('displayName')});
            lastSuccessful.on('change', function () {
                this.$('.last-production-deployment').countdown({
                    since: new Date(lastSuccessful.get('timestamp')), 
                    layout: '{dn} {dl} {hn} {hl} {mn} {ml} ago'
                });
            }, this);

            lastSuccessful.fetch();
        }
    });
});