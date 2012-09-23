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
              this.model.fetch();
            });
        },

        fadeIn: function () {
            this.$('#loading-fields-' + this.random).fadeOut();
            this.$('.form-horizontal').css('visibility', 'visible').fadeIn();
        },

        fadeOut: function () {
            this.spinner();
            this.$('#loading-fields-' + this.random).fadeIn();
            this.$('.form-horizontal').css('visibility', 'visible').fadeOut();
        },

        confirm: function () {

            return false;
        }
    });
});
