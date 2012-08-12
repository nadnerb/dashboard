Dashboard.Model.Build = Backbone.Model.extend({
    next: null,

    hasNext: function () {
        return this.next !== null;
    }
});