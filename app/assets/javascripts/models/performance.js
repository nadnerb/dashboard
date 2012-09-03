define([
    'backbone'
], function (Backbone) {

    return Backbone.Model.extend({
        url: 'dashboard/performance',

        validate: function (attrs) {
            if (attrs.not_configured === true){
                return;
            }

            var errors = [];

            if (attrs.token === '') {
                errors.push({name: 'token', message: 'You must provide a token'});
            }

            if (_(errors).isEmpty()) {
                return;
            }

            return errors;
        }
    });
});
