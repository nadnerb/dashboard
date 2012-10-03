define([
    'vendor/base',
    'views/widget-view',
    'models/cost',
    'collections/builds',
    'text!templates/total-cost.html.haml',
    'text!templates/build-passing.html.haml',
    'text!templates/index.html.haml'
], function (BackboneSuperView, WidgetView, Cost, BuildsCollection, totalCostTemplate, buildPassingTemplate, template) {
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

            setTimeout(function () {
                that.costModel.fetch();
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
        },

        renderTotalCost: function () {
            this.totalCostView.empty();
            this.totalCostView.appendTemplate(totalCostTemplate, this.costModel);
        },

        renderBuild: function () {
            var canCommit = this.buildsCollection.all(function (build) {
                return build.canCommit();
            });

            this.buildView.appendTemplate(buildPassingTemplate, new Backbone.Model({canCommit: canCommit}));
        }
    });
});

