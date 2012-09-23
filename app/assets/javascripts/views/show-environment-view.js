define([
    'views/modal-view',
    'models/stack',
    'text!templates/show-environment.html.haml'
], function (ModalView, Stack, template) {
    return ModalView.extend({
        template: template,

        events: {
            'click .confirm': 'confirm'
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
                model: this.model,
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
            // this.$('.web-instances').html();
            // this.$('.dns').html();
            // ...
        },

        confirm: function () {
            return false;
        }
    });
});