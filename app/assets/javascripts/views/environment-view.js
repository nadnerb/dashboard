define([
    'backbone',
    'models/instance',
    'models/stack',
    'views/create-environment-view',
    'views/show-environment-view',
    'views/instances-view',
    'text!templates/create_environment.html.haml',
    'text!templates/available_environment.html.haml',
    'text!templates/environment.html.haml'
], function (Backbone, Instance, Stack, CreateEnvironmentView, ShowEnvironmentView, InstancesView, createEnvironmentTemplate, availableEnvironmentTemplate, template) {
    return Backbone.SuperView.extend({

        events: {
            'click .start': 'start',
            'click .stop': 'stop',
            'click .remove': 'removeIt',
            'click .create': 'create',
            'click .edit': 'edit',
            'click .reboot': 'reboot',
            'click .instances': 'instances',
            'click .info': 'info'
        },

        className: 'environment span4 loading',

        template: availableEnvironmentTemplate,

        interval: null,

        view: null,

        serialize: function () {
            var instances = this.instancesCollection;
            if (instances !== undefined) {
                instances = instances.toJSON();
            }

            return {
                model: this.model.toJSON(),
                instances: instances
            };
        },

        renderEnvironment: function () {
            this.template = template;
            return this.render();
        },

        renderCreateEnvironment: function () {
            this.template = createEnvironmentTemplate;
            this.$el.addClass('not-created');
            return this.render();
        },

        fadeIn: function () {
            var view = this;
            setTimeout(function () {
                view.$el.removeClass('loading');
                view.$('.environment-information').css('visibility', 'visible').fadeIn();
            }, Math.random() * 1000);
        },

        fadeOut: function () {
            this.$el.addClass('loading');
            this.$('.environment-information').empty();
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

        removeIt: function () {
            if (confirm("Are you sure you want to remove this environment?")) {
                this.fadeOut();
                var stack = new Stack({id: this.model.get('tags')['aws:cloudformation:stack-name']});
                this.bindTo(stack, 'destroy', function () {
                    this.keepChecking();
                });
                stack.destroy();
            }

            return false;
        },

        reboot: function () {
            this.handleAction('reboot');
            return false;
        },

        create: function () {
            this.view = new CreateEnvironmentView({name: this.model.get('name')}).render();
            this.bindTo(this.view.model, 'saved', function () {
                this.view.hide();
                this.fadeOut();
                this.keepChecking();
            });
            this.view.show();

            return false;
        },

        info: function () {
            this.view = new ShowEnvironmentView().render();
            this.view.model.set({id: this.model.get('tags')['aws:cloudformation:stack-name']}, {silent: true});
            this.view.model.fetch();
            this.view.show();
            return false;
        },

        edit: function () {
            this.view = new CreateEnvironmentView({edit: true}).render();
            this.view.model.set({id: this.model.get('tags')['aws:cloudformation:stack-name']}, {silent: true});
            this.view.model.fetch();
            this.bindTo(this.view.model, 'saved', function () {
                this.view.hide();
                this.fadeOut();
                this.keepChecking();
            });

            this.view.show();
            return false;
        },

        instances: function () {
            this.view = new InstancesView({collection: this.instancesCollection}).render();
            this.bindTo(this.view.collection, 'success error', function () {
                this.view.hide();
                this.fadeOut();
                this.keepChecking();
            });

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
                if (this.model.get('status') === 'terminated') {
                    this.model = this.availableModel;
                    this.renderCreateEnvironment().fadeIn();
                    clearInterval(this.interval);
                    event.unbind();
                }

                if (!_(['pending', 'stopping', 'shutting_down']).include(this.model.get('status'))) {
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
