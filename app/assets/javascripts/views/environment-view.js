define([
    'vendor/base',
    'text!templates/environment.html.haml'
], function (BackboneSuperView, template) {
    return BackboneSuperView.extend({

        className: 'environment',

        template: template,

        fetchInstance: function () {
            spinner('loading-' + this.model.get('tags')['aws:cloudformation:stack-name'], 50, 45, 15, 3, '#888');

            var view = this;
            setTimeout(function () {
                view.renderInstance();
            }, Math.random() * 1000);
        },

        renderInstance: function () {
            this.$('.environment-loading').fadeOut();
            this.$('.environment-information').css('visibility', 'visible').fadeIn();
        }
    });
})