define([
    'vendor/base'
], function (BackboneSuperView) {
    return BackboneSuperView.extend({

        className: 'modal hide fade in',

        random: null,

        initialize: function () {
            this.random = Math.round(Math.random() * 1000);

            this.$el.modal({
                keyboard: true,
                show: false
            });

            // var view = this;
            // this.$el.on('shown', function () {
            //     view.spinner();
            // });
        },

        show: function () {
            this.$el.modal('show');
        },

        hide: function (event) {
            if (event) {
                event.preventDefault();
            }
            
            this.$el.modal('hide');
        },

        spinner: function () {
            spinner('loading-fields-' + this.random, 50, 45, 15, 3, '#888');
        }
    });
});