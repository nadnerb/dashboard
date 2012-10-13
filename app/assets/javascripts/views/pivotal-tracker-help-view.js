define([
    'views/modal-view',
    'text!templates/pivotal-tracker-help.html.haml'
], function (ModalView, template) {
    return ModalView.extend({
        template: template,

        events: {
            'click .cancel': 'hide'
        }
    });
});