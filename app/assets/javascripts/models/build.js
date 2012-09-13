define([
    'backbone'
], function (Backbone) {

    var NAMES = {
        'Build_Project': 'Build',
        'Acceptance_Test': 'Acceptance',
        'Deployment_Test': 'Deployment Test',
        'Deploy_To_QA': 'Deploy to QA',
        'Deploy_To_Staging': 'Deploy to Performance',
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
        },

        isProductionBuild: function () {
            return this.get('niceName') === 'Deploy to Production';
        },

        canCommit: function () {
            if (this.get('niceName') !== 'Build' && this.get('niceName') !== 'Acceptance') {
                return true;
            }

            return this.get('lastCompletedBuild').number === this.get('lastSuccessfulBuild').number;
        },

        isCurrentlyFailing: function () {
            if (this.get('lastFailedBuild') === null) {
                return false;
            }

            return this.get('lastFailedBuild').number > this.get('lastSuccessfulBuild').number;
        }
    });
});