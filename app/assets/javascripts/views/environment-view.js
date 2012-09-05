define([
    'vendor/base',
    'models/instance',
    'text!templates/environment.html.haml'
], function (BackboneSuperView, Instance, template) {
    return BackboneSuperView.extend({

        events: {
            'click .start': 'start',
            'click .stop': 'stop',
            'click .remove': 'remove'
        },

        className: 'environment span4',

        template: template,

        interval: null,

        initialize: function () {
            this.bindTo(this.model, 'sync', function () {
                this.render();
                this.fadeIn();
            });
        },

        fetchInstance: function () {
            spinner('loading-' + this.model.get('tags')['dupondius:environment'], 50, 45, 15, 3, '#888');
            this.fadeIn();
        },

        fadeIn: function () {
            var view = this;
            setTimeout(function () {
                view.$('.environment-loading').fadeOut();
                view.$('.environment-information').css('visibility', 'visible').fadeIn();
            }, Math.random() * 1000);
        },

        fadeOut: function () {
            this.$('.environment-loading').fadeIn();
            this.$('.environment-information').fadeOut();
        },

        updateInstance: function () {
            this.$('.environment-information .status').text(this.model.get('status'));
            this.$('.environment-information .size').text(this.model.get('instance_type'));
        },

        start: function () {
            if (this.$('.start.disabled').length !== 0) {
                return;
            }
            if (confirm("Are you sure you want to start this environment?")) {
                this.fadeOut();
                this.keepChecking();
                this.model.save({
                    status: 'start'
                });
            }
            return false;
        },

        stop: function () {
            if (this.$('.stop.disabled').length !== 0) {
                return;
            }

            if (confirm("Are you sure you want to stop this environment?")) {
                this.fadeOut();
                this.keepChecking();
                this.model.save({
                    status: 'stop'
                });
            }
            return false;
        },

        remove: function () {
            if (confirm("Are you sure you want to remove this environment?")) {
                this.fadeOut();
                this.keepChecking();
                this.model.save({
                    status: 'terminate'
                });
            }
            return false;
        },

        keepChecking: function () {
            // this.bindTo(this.model, 'change', function () {
            //     if (this.model.get('status') !== 'pending' && this.model.get('status') !== 'stopping') {
            //         // this.render();
            //         this.interval = null;
            //     }
            // });

            // var view = this;
            // this.interval = setInterval(function () {
            //     view.model.fetch();
            // }, 30000);
        }
    });
})