define([
    'libs/base',
    'views/widget-view',
    'models/cost',
    'models/velocity',
    'collections/builds',
    'text!templates/total-cost.html.haml',
    'text!templates/build-passing.html.haml',
    'text!templates/index.html.haml'
], function (BackboneSuperView, WidgetView, Cost, Velocity, BuildsCollection, totalCostTemplate, buildPassingTemplate, template) {
    return BackboneSuperView.extend({

        id: 'index-view',

        template: template,

        className: 'row',

        totalCostView: null,

        initialize: function (options) {
            this.costModel = new Cost();
            this.bindTo(this.costModel, 'change', function () {
                this.renderTotalCost();
            });
            var that = this;

            this.velocityModel = new Velocity();
            this.bindTo(this.velocityModel, 'change', function () {
                this.renderVelocity();
            });

            setTimeout(function () {
                that.costModel.fetch();
                that.velocityModel.fetch();
            }, 1000);

            this.buildsCollection = new BuildsCollection();
            this.bindTo(this.buildsCollection, 'reset', function () {
                this.renderBuild();
            });
            this.buildsCollection.fetch();
        },

        postRender: function () {
            this.totalCostView = new WidgetView({
                 heading: 'Estimated Cost Per Month',
                 contentId: 'total-cost-widget',
                 extraClassName: 'span3'
            }).render();
            this.$el.append(this.totalCostView.el);

            this.velocityView = new WidgetView({
                 heading: 'Current Velocity',
                 contentId: 'velocity-widget',
                 extraClassName: 'span3'
            }).render();
            this.$el.append(this.velocityView.el);

            this.buildView = new WidgetView({
                 heading: 'Build Status',
                 contentId: 'build-widget',
                 extraClassName: 'span6'
            }).render();
            this.$el.append(this.buildView.el);
        },

        renderTotalCost: function () {
            this.totalCostView.empty().appendTemplate(totalCostTemplate, this.costModel);
        },

        renderVelocity: function () {
            if (this.velocityModel.get('not_configured')) {
                this.velocityView.empty().append('<div id="pivotal-not-configured">Pivotal Tracker <a href="#stories">needs to be configured.</a></div>');
            } else {
                this.velocityView.empty().append('<h1 id="current-velocity">' + this.velocityModel.get('current_velocity') + '</h1>');
            }
        },

        renderBuild: function () {
            var canCommit = this.buildsCollection.all(function (build) {
                return build.canCommit();
            });

            this.buildView.appendTemplate(buildPassingTemplate, new Backbone.Model({canCommit: canCommit}));
        }
    });
});