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
//              _this.$('footer .version').html("Version: " + data.version + ", Git SHA: " + data.git_commit +
//                ", Build Date: " + data.build_date);
              _this.$('footer .version').html("<div>Version: " + data.version + "</div>");
//                .popover({
//                trigger: 'hover', content: "<dl><dt>Git SHA</dt><dd>" + data.git_commit +
//                  "</dd><dt>Build Date</dt><dd>" + data.build_date + "</dd>", placement: 'left',
//                  title: "Version Info"});

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
