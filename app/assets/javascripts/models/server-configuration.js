define([
  'backbone'
], function (Backbone) {

  return Backbone.Model.extend({
    urlRoot: 'dashboard/configuration/',

     validate: function (attrs) {
       if (attrs.not_configured === true){
         return;
       }

       var errors = [];

       // TODO leave validations on shared model for the moment
       // maybe do it in the view at this stage
       //if (attrs.iframe === '') {
         //errors.push({name: 'token', message: 'You must provide an token'});
       //}

       if (_(errors).isEmpty()) {
         return;
       }

       return errors;
     }
  });
});
