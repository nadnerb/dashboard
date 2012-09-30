define([
  'backbone'
], function (Backbone) {

  return Backbone.Model.extend({
    urlRoot: 'dashboard/performance',

     validate: function (attrs) {
       var errors = [];

       if (attrs.iframe === '') {
         errors.push({name: 'iframe', message: 'You must provide an iframe or url'});
       }
       if (attrs.invalid) {
         errors.push({name: 'iframe', message: attrs.invalid});
       }

       if (_(errors).isEmpty()) {
         return;
       }

       return errors;
     }
  });
});
