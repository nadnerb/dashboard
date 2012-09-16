define([
    'vendor/base',
    'text!templates/instance.html.haml'
], function (BackboneSuperView, template) {
    return BackboneSuperView.extend({
        template: template,

        tagName: 'tr',

        events: {
            'click .reboot': 'reboot',
            'click .remove': 'remove',
            'click .start': 'start',
            'click .stop': 'stop'
        },

        start: function (event) {
            this.handleAction('start');
            return false;
        },

        stop: function (event) {
            this.handleAction('stop');
            return false;
        },

        remove: function (event) {
            this.handleAction('remove', 'terminate');
            return false;
        },

        reboot: function (event) {
            this.handleAction('reboot');
            return false;
        },

        fadeIn: function () {
            this.$('#loading-' + this.model.get('tags')['dupondius:dev-name']).css('visibility', 'visible').fadeOut();
            this.$('.buttons').fadeIn();
        },

        fadeOut: function () {
            this.spinner();
            this.$('#loading-' + this.model.get('tags')['dupondius:dev-name']).css('visibility', 'visible').fadeIn();
            this.$('.buttons').fadeOut();
        },

        spinner: function () {
            var name = this.model.get('tags')['dupondius:dev-name'];
            if (this.$('#loading-' + name + ' svg').length === 0) {
                spinner('loading-' + name, 9, 8, 10, 3, '#888');
            }
        },

        handleAction: function (action, status) {
            if (this.$('.' + action + '.disabled').length !== 0) {
                return;
            }

            if (confirm("Are you sure you want to " + action + " this environment?")) {
                this.fadeOut();
                this.model.save({
                    status: status || action
                });
                this.keepChecking();
            }
        },

        keepChecking: function () {
            var event = this.bindTo(this.model, 'change', function () {
                if (this.model.get('status') !== 'pending' && this.model.get('status') !== 'stopping') {
                    this.render().fadeIn();
                    clearInterval(this.interval);
                    event.unbind();
                }
            });

            var view = this;
            this.interval = setInterval(function () {
                view.model.fetch();
            }, 10000);
        }
    });
});