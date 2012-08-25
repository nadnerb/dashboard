define([
    'collections/builds',
    'views/widget-view',
    'views/build-information-view',
    'views/build-pipeline-view'
], function (BuildsCollection, WidgetView, BuildInformationView, BuildPipelineView) {
    return WidgetView.extend({

        className: 'builds',

        initialize: function (options) {
            WidgetView.prototype.initialize.call(this, options);

            this.collection = new BuildsCollection();
            this.collection.on('reset', function () {
                this.$('.message').remove();
            }, this);
        },

        postRender: function () {
            WidgetView.prototype.postRender.call(this);
            this.append(this.make('span', {class: 'message span12'}, 'Negotiating with Jenkins...'));
            this.append(new BuildPipelineView({collection: this.collection}).render().el);
            this.append(new BuildInformationView({collection: this.collection}).render().el);
            this.checkPeriodically();
        },

        checkPeriodically: function () {
            var infiniteFetch = function (collection) {
                collection.fetch();
                setTimeout(function () {
                    infiniteFetch(collection);
                }, 10000);
            };

            infiniteFetch(this.collection);
        }
    });
});