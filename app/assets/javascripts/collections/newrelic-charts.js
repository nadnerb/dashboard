define([
    'backbone',
    'models/newrelic-chart'
], function (Backbone, Instance) {
    return Backbone.Collection.extend({

        model: Instance,

        url: 'dashboard/performance'
    });
});