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

        confirm: function () {

            return false;
        }
    });
});
