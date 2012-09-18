define([
    'backbone'
], function (Backbone) {
    return Backbone.Model.extend({
        url: '/aws/instances/cost'
    });
});