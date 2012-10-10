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

        initialize: function () {
          this.options = {
              heading: 'Server performance',
              contentId: 'server-performance-widget'
          };
          WidgetView.prototype.initialize.call(this, this.options);
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
            this.append('<iframe src="/dashboard/newrelic/summary"></iframe>');
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
          $('#newrelic_token').val(this.configuration.get('newrelic_token') || '');
          this.$('#token').removeClass('error');
          this.$('#token .help-block').html('');
          $('#newrelic_key').val(this.configuration.get('newrelic_key') || '');
          this.$('#key').removeClass('error');
          this.$('#key .help-block').html('');
          $('#server-config-modal').modal();
        },

      confirmToken: function (event) {
        event.preventDefault();
        this.$('#token').removeClass('error');
        this.$('#token .help-block').html('');
        this.$('#key').removeClass('error');
        this.$('#key .help-block').html('');
        var key = $('#newrelic_key').val();
        if (!key) {
          this.$('#key').addClass('error');
          this.$('#key .help-block').html('New Relic license key is required');
        } else {
          this.configuration.set({'newrelic_key': key, 'newrelic_token': $('#newrelic_token').val()});
          this.configuration.save({}, {
            error: function (model, response) {
              this.$('#key').addClass('error');
              this.$('#key .help-block').html(JSON.parse(response.responseText).join(', '));
            },
            success: function (model, response) {
              $('#server-config-modal').modal('hide');
            }
          });
        }
      }

    });
});
