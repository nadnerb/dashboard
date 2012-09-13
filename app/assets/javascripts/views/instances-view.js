define([
    'views/modal-view',
    'collections/instances',
    'text!templates/instances.html.haml'
], function (ModalView, InstancesCollection, template) {
    return ModalView.extend({
        template: template,

        events: {
            'click .cancel': 'hide'
        },

        serialize : function() {
            return {
                random: this.random,
                collection: this.collection.toJSON()
            };
        },
    });
});