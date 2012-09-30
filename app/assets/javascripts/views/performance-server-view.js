define([
    'vendor/base',
    'models/server-configuration',
    'views/widget-view',
    'text!templates/configure-newrelic-server.html.haml',
    'text!templates/configure-newrelic.html.haml'
], function (BackboneSuperView, ServerConfiguration, WidgetView, configureTemplate, modalTemplate) {
    return WidgetView.extend({

        id: 'server-performance-config',

        events: {
            'click .configure-newrelic-btn': 'configure',
            'click #server-config-modal .confirm': 'confirmToken'
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
          var token = this.configuration.get('newrelic_token');
          if (!token) {
            this.append(haml.compileHaml({source: configureTemplate})());
          } else {
            var _this = this;
            $.ajax('dashboard/newrelic/summary', {
              success: function (data) {
                _this.append(data);
              }
            });
          }
        },

        renderControls: function () {
          this.$('.widget-header h3').append('<div class="widget-toolbar"><a id="newrelic-config-btn" class="btn configure-newrelic-btn" href="#" rel="tooltip" title="Configuration"><i class="icon-cog"/></a></div>');
        },

        configure: function (event) {
          event.preventDefault();
          if (!this.$('#server-config-modal').length) {
            this.$el.append(haml.compileHaml({source: modalTemplate})());
          }
          var token = this.configuration.get('newrelic_token');
          if (token) {
            $('#newrelic_token').val(token);
          } else {
            this.$('#token').removeClass('error');
            this.$('#token .help-block').html('');
          }
          $('#server-config-modal').modal();
        },

      confirmToken: function (event) {
        event.preventDefault();
        this.$('#token').removeClass('error');
        this.$('#token .help-block').html('');
        var token = $('#newrelic_token').val();
        if (!token) {
          this.$('#token').addClass('error');
          this.$('#token .help-block').html('API token is required');
        } else {
          this.configuration.set({'newrelic_token': token});
          this.configuration.save({}, {
            error: function (model, response) {
              this.$('#token').addClass('error');
              this.$('#token .help-block').html(JSON.parse(response.responseText).join(', '));
            },
            success: function (model, response) {
              $('#server-config-modal').modal('hide');
            }
          });
        }
      }

    });
});
