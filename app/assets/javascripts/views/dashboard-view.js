define([
    'vendor/base',
    'views/navigation-view',
    'text!templates/dashboard.html.haml'
], function (BackboneSuperView, NavigationView, template) {
    return BackboneSuperView.extend({

        className: 'container-fluid',

        template: template,

        currentView: null,

        postRender: function () {
            var navigationView = new NavigationView();
            navigationView.render();
            $('body').prepend(navigationView.el);
            navigationView.renderImages();

            var _this = this;
            $.get('/status', function (data) {
              _this.$('footer .version').html("<div>Version: " + data.version + "</div>");
            });
        },


        add: function (view) {
            this.currentView = view;
            this.currentView.render();
            this.$('#dashboard-contents').append(this.currentView.el);
        },

        apply: function (view) {
            if (this.currentView !== null) {
                this.currentView.destroy();
            }

            this.currentView = view;
            this.currentView.render();
            this.$('#dashboard-contents').html(this.currentView.el);
        }
    });
});
