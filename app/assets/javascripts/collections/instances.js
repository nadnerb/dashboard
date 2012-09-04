define([
    'backbone',
    'models/ec2-instance'
], function (Backbone, Ec2Instance) {
    return Backbone.Collection.extend({

        model: Ec2Instance,

        url: 'dashboard/instances'

    });
});