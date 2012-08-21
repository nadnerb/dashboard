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
            this.$('.widget-content').attr('id', this.options.contentId);
        },

        append: function (content) {
          this.$('.widget-content').append(content);
        }
    });
});