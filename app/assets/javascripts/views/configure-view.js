define([
    'vendor/base',
    'collections/available',
    'collections/instances',
    'views/widget-view',
    'views/environment-view',
    'text!templates/environments.html.haml'
], function (BackboneSuperView, AvailableCollection, InstancesCollection, WidgetView, EnvironmentView, template) {
    return BackboneSuperView.extend({

        className: 'environments',

        views: [],

        initialize: function () {
            this.views = [];
            this.availableCollection = new AvailableCollection();
            this.collection = new InstancesCollection();

            this.bindTo(this.availableCollection, 'reset', function () {
                this.$('.message').remove();
                this.renderAvailableEnvironments();
                var view = this;
                setTimeout( function () {
                    view.collection.fetch();
                }, 100);
            });

            this.bindTo(this.collection, 'reset', function () {
                this.renderEnvironments();
            });
        },
        
        postRender: function () {
            var view = new WidgetView({
                 heading: 'Environments',
                 contentId: 'environments-widget'
            }).render();
            view.appendTemplate(template);
            view.$('.widget-content').addClass('row');
            this.renderEnvironments();
            this.$el.html(view.el);
        },

        renderAvailableEnvironments: function () {
            this.availableCollection.each(function (availableEnvironment) {
                this.renderAvailableEnvironment(availableEnvironment);
            }, this);
        },

        renderEnvironments: function () {
            this.collection.each(function (environment) {
                this.bindEnvironment(environment);
            }, this);

            _(this.views).each(function (view) {
                if (view.model.has('name')) { // needs to be created?
                    view.renderCreateEnvironment().fadeIn();
                } else {
                    view.renderEnvironment().fadeIn(); 
                }
            }, this);
        },

        renderAvailableEnvironment: function (availableEnvironment) {
            var view = new EnvironmentView({model: availableEnvironment}).render();
            this.$('.widget-content .content').append(view.el);
            this.views.push(view);
        },

        bindEnvironment: function (environment) {
            if (environment.get('status') === 'terminated') {
                return;
            }

            var view = _(this.views).find(function (environmentView) {
                if (environmentView.model.has('name')) {
                    return environmentView.model.get('name') === this.envNameFrom(environment.get('tags')['dupondius:environment']);
                } else {
                    return this.envNameFrom(environmentView.model.get('tags')['dupondius:environment']) === this.envNameFrom(environment.get('tags')['dupondius:environment']);
                }
            }, this);

            if (view === undefined) {
                return; // foreign instance that we dont care about
            }

            if (view.model.has('name')) { 
                view.availableModel = view.model;
                view.model = environment;
            } 

            if (view.instancesCollection === undefined) {
                view.instancesCollection = new InstancesCollection();
            }

            view.instancesCollection.push(environment);
        },

        envNameFrom: function (name) {
            var returned = name;
            if (_(name).startsWith('dev')) {
                returned = name.replace(/(dev)-.*/, '$1');
            }

            return returned;
        },

        destroy: function () {
            _(this.views).each(function (view) {
                view.destroy();
            }, this);
            BackboneSuperView.prototype.destroy.call(this);
        }
    });
});