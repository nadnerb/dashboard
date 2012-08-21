define([
    'backbone'
], function (Backbone) {

    var NAMES = {
        'Build_Project': 'Build',
        'Acceptance_Test': 'Acceptance',
        'Deployment_Test': 'Deploy',
        'Deploy_To_QA': 'Deploy to QA',
        'Deploy_To_Staging': 'Deploy to Staging',
        'Deploy_To_Production': 'Deploy to Production'
    };

    return Backbone.Model.extend({
        next: null,

        hasNext: function () {
            return this.next !== null;
        },

        parse: function(resp, xhr) {
            resp.niceName = NAMES[resp.displayName];
            return resp;
        }
    });
});