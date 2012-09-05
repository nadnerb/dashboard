define([
    'vendor/base',
    'collections/instances',
    'views/widget-view',
    'views/environment-view',
    'text!templates/environments.html.haml'
], function (BackboneSuperView, InstancesCollection, WidgetView, EnvironmentView, template) {
    return BackboneSuperView.extend({

        className: 'environments',

        initialize: function () {
            this.collection = new InstancesCollection();
            this.bindTo(this.collection, 'reset', function () {
                this.$('.message').remove();
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

        renderEnvironments: function () {
            this.collection.each(this.renderEnvironment);
        },

        renderEnvironment: function (environment) {
            var view = new EnvironmentView({model: environment}).render();
            this.$('.widget-content').append(view.el);
            view.fetchInstance();
        }
    });
});