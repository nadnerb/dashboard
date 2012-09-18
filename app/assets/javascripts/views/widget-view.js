define([
    'vendor/base',
    'backbone',
    'text!templates/widget.html.haml'
], function (BackboneSuperView, Backbone, template) {
    return BackboneSuperView.extend({

        className: 'widget',

        template: template,

        initialize: function (options) {
            this.model = new Backbone.Model({heading: options.heading});
        },

        postRender: function () {
            this.$el.attr('id', this.options.contentId + '-wrapper');
            this.$('.widget-content').attr('id', this.options.contentId);
        },

        append: function (content) {
            this.$('.widget-content').append(content);
        },

        appendTemplate: function (content, model) {
            var obj;
            if (model) {
                obj = model.toJSON();
            }

            this.append(haml.compileHaml({source: content})(obj));
        },

        empty: function () {
            this.$('.widget-content').empty();  
        }
    });
});