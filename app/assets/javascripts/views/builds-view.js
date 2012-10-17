define([
    'collections/builds',
    'views/widget-view',
    'views/build-information-view',
    'views/build-pipeline-view'
], function (BuildsCollection, WidgetView, BuildInformationView, BuildPipelineView) {
    return WidgetView.extend({

        className: 'builds '  + WidgetView.prototype.className,

        infiniteFetch: null,

        views: [],

        initialize: function (options) {
            WidgetView.prototype.initialize.call(this, options);
            this.views = [];

            this.collection = new BuildsCollection();
            var listener = this.bindTo(this.collection, 'reset', function () {
                this.appendView(BuildPipelineView).
                appendView(BuildInformationView).
                checkPeriodically();
                
                listener.unbind();
            }); 

            this.collection.fetch();
        },

        postRender: function () {
            WidgetView.prototype.postRender.call(this);
            this.$('.widget-content').addClass('row');
        },

        appendView: function (View) {
            var view = new View({collection: this.collection});
            this.views.push(view);
            this.append(view.render().el);
            return this;
        },

        checkPeriodically: function () {
            var infiniteFetch = function (collection) {
                collection.fetch();
                this.infiniteFetch = setTimeout(function () {
                    infiniteFetch(collection);
                }, 10000);
            };

            infiniteFetch(this.collection);
        },

        destroy: function () {
            WidgetView.prototype.destroy.call(this);
            _(this.views).each(function (view) {
                view.destroy();
            });
            clearTimeout(this.infiniteFetch);
        }
    });
});