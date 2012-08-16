define([
    'vendor/base',
    'views/navigation-view',
    'text!templates/dashboard.html.haml'
], function (BackboneSuperView, NavigationView, template) {
    return BackboneSuperView.extend({

        template: template,

        postRender: function () {
            var navigationView = new NavigationView();
            navigationView.render();
            $('body').prepend(navigationView.el);
            navigationView.renderImages();
        },

        apply: function (view) {
            this.$('#dashboard-contents').html(view.el);
        }
    });
});