define([
    'vendor/base',
    'models/server-configuration',
    'views/widget-view',
    'text!templates/configure-newrelic-server.html.haml'
], function (BackboneSuperView, ServerConfiguration, WidgetView, configureTemplate) {
    return WidgetView.extend({

        id: 'server-performance-config',

        events: {
            'click .configure-newrelic-btn': 'configure'
        },

        initialize: function (options) {
          WidgetView.prototype.initialize.call(this, {
              heading: 'Server performance',
              contentId: 'server-performance-widget'
          });
          this.configuration = new ServerConfiguration();
          this.configuration.on('change', function () {
            this.render();
          }, this);
          this.configuration.fetch();
        },

        postRender: function () {
          WidgetView.prototype.postRender.call(this);
          this.renderControls();
          this.append(haml.compileHaml({source: configureTemplate})());
        },

        renderControls: function () {
          this.$('.widget-header h3').append('<div class="widget-toolbar"><a id="newrelic-config-btn" class="btn configure-newrelic-btn" href="#" rel="tooltip" title="Configuration"><i class="icon-cog"/></a></div>');
        },

        renderConfigurePerformanceServer: function () {
            var view = new WidgetView({
               heading: 'Configure New Relic Server Monitoring',
               contentId: 'configure-newrelic-server-widget'
            }).render();

            view.appendTemplate(configureTemplate);

            this.$el.html(view.el);
        },

        configure: function (event) {
//            var token = this.$('#newrelic_token').val();
//
//            this.configuration.on('error', function (configuration, errors) {
//                _(errors).each(function (error) {
//                    this.$('#' + error.name).addClass('error');
//                    this.$('#' + error.name + ' .help-inline').text(error.message);
//                }, this);
//            }, this);
//
//            this.$('.control-group').removeClass('error');
//            this.$('.help-inline').empty();
//
//            this.configuration.save({
//                invalid: undefined,
//                newrelic_token: token
//            });
//
//            return false;

          event.preventDefault();
        }

    });
});
