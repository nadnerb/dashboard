define([
    'vendor/base',
    'models/iteration',
    'text!templates/stories.html.haml'
], function (BackboneSuperView, Iteration, template) {
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
            var r = Raphael(this.id, 620, 370);
            var chart = r.linechart(
                10, 10,
                600, 350,
                [this.model.burnDownDates()], 
                [this.model.burnDownValues()], 
                {
                   nostroke: false,
                   axis: "0 0 1 1",
                   smooth: false,
                   width: 3,
                   symbol: 'circle',
                   colors: ["#2B5FB3"]
                }
            );

            _(chart.axis[0].text.items).each(function (item) {
                var date = new Date(parseInt(item.attr("text"))); 
                item.attr('text', date.toDateString());
            });
        }
    });
});