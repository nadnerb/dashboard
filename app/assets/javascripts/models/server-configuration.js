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

       if (attrs.newrelic_key === '') {
         errors.push({name: 'key', message: 'You must provide new relic license key'});
       }

       if (_(errors).isEmpty()) {
         return;
       }

       return errors;
     }
  });
});
