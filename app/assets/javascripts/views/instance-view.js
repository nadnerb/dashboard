define([
    'libs/base',
    'models/stack',
    'text!templates/instance.html.haml'
], function (BackboneSuperView, Stack, template) {
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
            if (confirm("Are you sure you want to remove this environment?")) {
                this.fadeOut();
                var stack = new Stack({id: this.model.get('tags')['aws:cloudformation:stack-name']});
                stack.destroy();
                this.keepChecking();
            }

            return false;
        },

        reboot: function (event) {
            this.handleAction('reboot');
            return false;
        },

        fadeIn: function () {
            this.$el.removeClass('loading');
            this.$('.buttons').fadeIn();
        },

        fadeOut: function () {
            this.$el.addClass('loading');
            this.$('.buttons').fadeOut();
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
                if (this.model.get('status') === 'terminated') {
                    this.model = this.availableModel;
                    this.render().fadeIn();
                    clearInterval(this.interval);
                    event.unbind();
                }

                if (!_(['pending', 'stopping', 'shutting_down']).include(this.model.get('status'))) {
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