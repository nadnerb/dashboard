define([
    'jquery',
    'vendor/base',
    'models/iteration',
    'text!templates/stories.html.haml'
], function ($, BackboneSuperView, Iteration, template) {
    return BackboneSuperView.extend({

        id: 'stories',

        template: template,

        initialize: function (options) {
            this.model = new Iteration();
            this.model.on('change', function () {
                this.render();
                this.renderImages();
            }, this);
        },

        renderImages: function () {
            var values = this.model.burnDownValues();
            var dates = this.model.burnDownDates();
            renderLineGraph(dates, values);
        }
    });
});