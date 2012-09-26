define([
    'vendor/base',
    'models/server-configuration',
    'views/widget-view',
    'text!templates/configure-newrelic-server.html.haml'
], function (BackboneSuperView, ServerConfiguration, WidgetView, configureTemplate) {
    return BackboneSuperView.extend({

        id: 'server-performance-config',

        events: {
            'click .btn': 'configure',
        },

        initialize: function (options) {
          this.model = new ServerConfiguration();
          this.model.on('change', function () {
            this.render();
          }, this);
          this.model.fetch();
        },

        postRender: function () {
          this.renderConfigurePerformanceServer();
          $('#newrelic_token').val(this.model.get('newrelic_token'));
        },

        renderConfigurePerformanceServer: function () {
            var view = new WidgetView({
               heading: 'Configure New Relic Server Monitoring',
               contentId: 'configure-newrelic-server-widget'
            }).render();

            view.appendTemplate(configureTemplate);

            this.$el.html(view.el);
        },

        configure: function () {
            var token = this.$('#newrelic_token').val();

            this.model.on('error', function (model, errors) {
                _(errors).each(function (error) {
                    this.$('#' + error.name).addClass('error');
                    this.$('#' + error.name + ' .help-inline').text(error.message);
                }, this);
            }, this);

            this.$('.control-group').removeClass('error');
            this.$('.help-inline').empty();

            this.model.save({
                invalid: undefined,
                newrelic_token: token
            });

            return false;
        }

    });
});
