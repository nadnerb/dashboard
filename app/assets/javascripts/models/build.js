define([
    'backbone'
], function (Backbone) {
    return Backbone.Model.extend({
        next: null,

        hasNext: function () {
            return this.next !== null;
        }
    });
});