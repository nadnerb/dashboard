define([
    'vendor/base',
    'views/navigation-view',
    'text!templates/dashboard.html.haml'
], function (BackboneSuperView, NavigationView, template) {
    return BackboneSuperView.extend({

        className: 'container-fluid',

        template: template,

        postRender: function () {
            var navigationView = new NavigationView();
            navigationView.render();
            $('body').prepend(navigationView.el);
            navigationView.renderImages();

            var _this = this;
            $.get('/status', function (data) {
              _this.$('footer .version').html("Version: " + data.version + ", Git SHA: " + data.git_commit +
                ", Build Date: " + data.build_date);
            });
        },

        apply: function (view) {
            this.$('#dashboard-contents').html(view.el);
        }
    });
});