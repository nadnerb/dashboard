define([
    'backbone'
], function (Backbone) {
    return Backbone.Model.extend({
        urlRoot: '/aws/stacks',

        validate: function (attrs) {
            var errors = [];

            _(attrs).each(function (value, field) {
                if (value === '') {
                    errors.push({
                        field: field,
                        message: 'Required'
                    });
                }
            });

            if (errors.length !== 0) {
                return errors;
            }
        }
    });
});