define([
    'views/modal-view',
    'models/stack',
    'text!templates/show-environment.html.haml'
], function (ModalView, Stack, template) {
    return ModalView.extend({
        template: template,

        events: {
            'click .confirm': 'hide'
        },

        initialize: function (options) {
            ModalView.prototype.initialize.call(this);

            this.model = new Stack();
            this.bindTo(this.model, 'change', function () {
                this.renderInformation();
                this.fadeIn();
            });
        },

        serialize: function () {
            return {
                model: this.model.toJSON(),
                random: this.random
            }
        },

        fadeIn: function () {
            this.$('#loading-' + this.random).fadeOut();
            this.$('dl').css('visibility', 'visible').fadeIn();
        },

        fadeOut: function () {
            this.spinner();
            this.$('#loading-' + this.random).fadeIn();
        },

        spinner: function () {
            spinner('loading-' + this.random, 50, 45, 15, 3, '#888');
        },

        renderInformation: function () {
            this.$('.name').html(this.model.get('name'));
            this.$('.description').html(this.model.get('description'));
            this.$('.status').html(this.model.get('status'));
            _(this.model.get('resource_summaries')).each(function (type) { 
                this.$('.resources ul').append('<li>' + type.resource_type + '</li>');
            });
            this.$('.modal-body').append('<a href="/aws/stacks/' + this.model.get('name') + '/template.json" target="_blank">View template</a>');
        }
    });
});
