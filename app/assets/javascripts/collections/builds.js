define([
    'backbone',
    'models/build'
], function (Backbone, Build) {
    return Backbone.Collection.extend({

        model: Build,

        firstInPipeline: null,

        url: 'http://ci.' + projectName + '.dupondi.us:8080/api/json?depth=1',

        parse: function(response) {
            return response.jobs;
        },

        pipeline: function () {
            this.each(function (build) {
                if (build.get('upstreamProjects').length === 0 && build.get('downstreamProjects').length !== 0) {
                    this.firstInPipeline = build;
                }

                _(build.get('downstreamProjects')).each(function (downstreamProject) {
                    build.next = this.filter(function (build) {
                        return build.get('displayName') === downstreamProject.name;
                    })[0];
                }, this);
            }, this);
        },

        sync: function(method, model, options) {  
            options.dataType = 'jsonp';  
            options.jsonp = 'jsonp';
            return Backbone.sync(method, model, options);  
        } 
    });
});