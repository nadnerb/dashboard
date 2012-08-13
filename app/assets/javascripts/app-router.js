Dashboard.Router = Backbone.Router.extend({
    routes: {
        'dashboard': 'default',
        'dashboard/:action': 'nav'
    },

    default: function () {
        this.nav('index');
    },

    nav: function (action) {
        var actionMethod = this[action];

        $.get('/dashboard/' + action, function (response) {
            $('#dashboard-contents').html($(response).find('#dashboard-contents').html());
            actionMethod();
        });
    },

    builds: function () {
        var collection = new Dashboard.Collection.Builds();
        var view = new Dashboard.View.BuildView({collection: collection});
        view.render();
        collection.fetch();
    },

    index: function () {

    },

    source: function () {},
    performance: function () {},
    configure: function () {},
    stories: function () {}
});

$(function () {
    var app = new Dashboard.Router();
    $('.navbar .nav a').click(function (event) {
        $('.navbar .nav li').removeClass('active');
        $(this).parent().addClass('active');
        var href = $(this).attr("href");
        res = app.navigate(href, true);
        return false;
    });

    Backbone.history.start({pushState: true});
});
