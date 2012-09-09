define([
    'backbone'
], function (Backbone) {

    return Backbone.Model.extend({

        url: function () {
            return 'http://ci.' + projectName + '.dupondi.us:8080/job/' + this.get('displayName') + '/lastFailedBuild/api/json';
        },

        sync: function(method, model, options) {  
            options.dataType = 'jsonp';  
            options.jsonp = 'jsonp';
            return Backbone.sync(method, model, options);  
        },

        theBreaker: function () {
            return _(this.get('culprits')).map(function (culprit) {
                return culprit.fullName;
            }).join(', ');
        }
    });
});