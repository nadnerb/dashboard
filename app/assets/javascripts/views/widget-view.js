define([
    'backbone',
    'text!templates/widget.html.haml'
], function (Backbone, template) {
    return Backbone.SuperView.extend({

        className: 'widget loading',

        template: template,

        serialize: function () {
            return {
                heading: this.options.heading
            };
        },

        postRender: function () {
            if (this.options.extraClassName) {
                this.$el.addClass(this.options.extraClassName);
            }
            this.$el.attr('id', this.options.contentId + '-wrapper');
            this.$('.widget-content').attr('id', this.options.contentId);
        },

        append: function (content) {
            this.$el.removeClass('loading');
            this.$('.widget-content .content').hide().append(content).fadeIn();
        },

        appendTemplate: function (content, model) {
            var obj;
            if (model) {
                obj = model.toJSON();
            }

            this.append(haml.compileHaml({source: content})(obj));
        },

        empty: function () {
            this.$el.removeClass('loading');
            this.$('.widget-content .content').empty();
            return this;
        }
    });
});