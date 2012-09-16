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
            this.availableCollection = new AvailableCollection();
            this.collection = new InstancesCollection();

            this.bindTo(this.availableCollection, 'reset', function () {
                this.$('.message').remove();
                this.renderAvailableEnvironments();
                this.collection.fetch();
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
            this.$('.widget-content').append(view.el);
            view.spinner();
            this.views.push(view);
        },

        bindEnvironment: function (environment) {
            if (environment.get('status') === 'terminated') {
                return;
            }

            var view = _(this.views).find(function (environmentView) {
                if (environmentView.model.has('name')) {
                    return environmentView.model.get('name') === environment.get('tags')['dupondius:environment'];
                } else {
                    return environmentView.model.get('tags')['dupondius:environment'] === environment.get('tags')['dupondius:environment'];
                }
            });

            if (view === undefined) {
                return; // foreign instance that we dont care about
            }

            if (view.model.has('name')) { 
                view.model = environment;
            } 

            if (view.instancesCollection === undefined) {
                view.instancesCollection = new InstancesCollection();
            }

            view.instancesCollection.push(environment);
        }
    });
});