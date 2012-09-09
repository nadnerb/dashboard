define([
    'vendor/base',
    'models/instance',
    'views/create-environment-view',
    'text!templates/create_environment.html.haml',
    'text!templates/available_environment.html.haml',
    'text!templates/environment.html.haml'
], function (BackboneSuperView, Instance, CreateEnvironmentView, createEnvironmentTemplate, availableEnvironmentTemplate, template) {
    return BackboneSuperView.extend({

        events: {
            'click .start': 'start',
            'click .stop': 'stop',
            'click .remove': 'remove',
            'click .create': 'create'
        },

        className: 'environment span4',

        template: availableEnvironmentTemplate,

        interval: null,

        view: null,

        initialize: function () {
            this.bindTo(this.model, 'sync', function () {
                this.render().fadeIn();
            });
        },

        renderEnvironment: function () {
            this.template = template;
            return this.render();
        },

        renderCreateEnvironment: function () {
            this.template = createEnvironmentTemplate;
            return this.render();
        },

        spinner: function () {
            var name = this.model.get('name') || this.model.get('tags')['dupondius:environment'];
            if (this.$('#loading-' + name + ' svg').length === 0) {
                spinner('loading-' + name, 50, 45, 15, 3, '#888');
            }
        },

        fadeIn: function () {
            var view = this;
            setTimeout(function () {
                view.$('.environment-loading').fadeOut();
                view.$('.environment-information').css('visibility', 'visible').fadeIn();
            }, Math.random() * 1000);
        },

        fadeOut: function () {
            this.spinner();
            this.$('.environment-loading').fadeIn();
            this.$('.environment-information').fadeOut();
        },

        updateInstance: function () {
            this.$('.environment-information .status').text(this.model.get('status'));
            this.$('.environment-information .size').text(this.model.get('instance_type'));
        },

        start: function () {
            this.handleAction('start');
            return false;
        },

        stop: function () {
            this.handleAction('stop');
            return false;
        },

        remove: function () {
            this.handleAction('remove', 'terminate');
            return false;
        },

        create: function () {
            if (this.view === null) {
                this.view = new CreateEnvironmentView().render();

                this.bindTo(this.view.model, 'success error', function () {
                    this.view.hide();
                    this.fadeOut();
                    this.keepChecking();
                });
            }
            
            this.view.show();
            return false;
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
                this.render().fadeIn();
                if (this.model.get('status') !== 'pending' && this.model.get('status') !== 'stopping') {
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
})