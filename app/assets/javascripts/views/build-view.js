define([
    'vendor/base',
    'text!templates/build.html.haml'
], function (BackboneSuperView, template) {

    return BackboneSuperView.extend({

        className: 'build',

        template: template,

        renderSpinner: function () {
            if (this.model.get('color').indexOf('anim') !== -1) {
                spinner('spinner-' + this.model.get('displayName'), 16, 15, 15, 3, '#fff');
            } else {
                this.$('.spinner').empty();
            }
        }
    });
});