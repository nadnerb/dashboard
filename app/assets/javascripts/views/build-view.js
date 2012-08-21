define([
    'vendor/base',
    'text!templates/build.html.haml'
], function (BackboneSuperView, template) {

    return BackboneSuperView.extend({

        className: 'build',

        template: template,

        renderSpinner: function () {
            if (this.model.get('color').indexOf('anim') !== -1) {
                if (this.$('.spinner svg').length === 0) {
                    spinner('spinner-' + this.model.get('displayName'), 16, 15, 15, 3, '#fff');
                }
            } else {
                this.$('.spinner').empty();
            }
        },

        update: function (model) {
            this.model = model;
            if (this.$('.build-' + this.model.get('color')).length === 0) {
                this.$('.build')
                    .removeClass('blue')
                    .removeClass('blue_anime')
                    .removeClass('red')
                    .removeClass('red_anime')
                    .removeClass('grey')
                    .removeClass('grey_anime')
                    .addClass(model.get('color'));
            }

            this.renderSpinner();
        }
    });
});