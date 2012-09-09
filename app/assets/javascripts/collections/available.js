define([
    'backbone'
], function (Backbone) {
    return Backbone.Collection.extend({
        url: '/aws/stacks/available'
    });
});