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

            var view = this;
            this.$el.on('hidden', function () {
                view.destroy();
            });
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

        loading: function (isLoading) {
            if (isLoading === true) {
                this.$el.addClass('loading');
            } else {
                this.$el.removeClass('loading');
            }
        }
    });
});