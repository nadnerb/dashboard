define([
  'backbone'
], function (Backbone) {

  return Backbone.Model.extend({
    urlRoot: 'dashboard/configurations/',

    //urlRoot: function() {
      //var url = 'dashboard/configurations/';
      //if(this.id) {
        //url = url + this.id;
      //}
      //return url;
    //},

     validate: function (attrs) {
       var errors = [];

       if (attrs.newrelic_token === '') {
         errors.push({name: 'token', message: 'You must provide new relic api token'});
       }

       if (_(errors).isEmpty()) {
         return;
       }

       return errors;
     }
  });
});
