define([
    'vendor/base',
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
                 heading: 'Total Cost',
                 contentId: 'total-cost-widget'
            }).render();
            this.totalCostView.append('<div id="loading-total-cost"></div>');
            this.$el.append(this.totalCostView.el);

            this.velocityView = new WidgetView({
                 heading: 'Current Velocity',
                 contentId: 'velocity-widget'
            }).render();
            this.velocityView.append('<div id="loading-velocity"></div>');
            this.$el.append(this.velocityView.el);

            this.buildView = new WidgetView({
                 heading: 'Build',
                 contentId: 'build-widget'
            }).render();
            this.$el.append(this.buildView.el);
        },

        spinner: function () {
            if (this.totalCostView.$('#loading-total-cost svg').length === 0) {
                spinner('loading-total-cost', 50, 45, 15, 3, '#888');
            }
            if (this.velocityView.$('#loading-velocity svg').length === 0) {
                spinner('loading-velocity', 50, 45, 15, 3, '#888');
            }
        },

        renderTotalCost: function () {
            this.totalCostView.empty();
            this.totalCostView.appendTemplate(totalCostTemplate, this.costModel);
        },

        renderVelocity: function () {
            if (this.velocityModel.get('not_configured')) {
                this.velocityView.empty();
                this.velocityView.append('<div id="pivotal-not-configured">Pivotal needs to be configured from the Stories Tab.</div>');
            } else {
                this.velocityView.empty();
                this.velocityView.append('<span id="current-velocity">' + this.velocityModel.get('current_velocity') + '</span>');
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

