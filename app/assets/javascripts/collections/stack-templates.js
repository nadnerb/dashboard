define([
    'backbone',
    'models/stack-template'
], function (Backbone, StackTemplate) {
    return Backbone.Collection.extend({
        model: StackTemplate,

        url: 'aws/templates'
    });
});