define([
    'vendor/base',
    'models/performance',
    'views/widget-view',
    'text!templates/configure-newrelic.html.haml',
    'text!templates/performance.html.haml'
], function (BackboneSuperView, Performance, WidgetView, configureTemplate, performanceTemplate) {
    return BackboneSuperView.extend({

        id: 'performance',

        events: {
            'click .btn': 'configure'
        },

        initialize: function (options) {
            this.model = new Performance();
            this.model.on('change', function () {
                this.render();
            }, this);
        },

        postRender: function () {
            if (this.model.has('token')) {
                this.renderMetrics();
            } else {
                this.renderConfigureNewRelic();
            }
        },

        renderConfigureNewRelic: function () {
            var view = new WidgetView({
               heading: 'Configure New Relic',
               contentId: 'configure-newrelic-widget'
            }).render();

            if (this.model.has('not_configured')) {
              view.appendTemplate(configureTemplate);
            } else {
              view.append('Loading...');
            }

            this.$el.html(view.el);
        },

        configure: function () {
            var token = this.$('#newrelic-token').val();

            this.model.on('error', function (model, errors) {
                _(errors).each(function (error) {
                    this.$('#' + error.name).addClass('error');
                    this.$('#' + error.name + ' .help-inline').text(error.message);
                }, this);
            }, this);

            this.$('.control-group').removeClass('error');
            this.$('.help-inline').empty();

            this.model.save({
                not_configured: undefined,
                token: token,
            });

            return false;
        },

        renderMetrics: function () {
          var view = new WidgetView({
            heading: 'New Relic',
          contentId: 'newrelic-widget'
          }).render();

          _this = this;
          X.ajax({
            type: "GET",
            //beforeSend: function(xhrObj){
              //xhrObj.setRequestHeader("x-api-key",_this.model.get('token'));
            //},
            headers: {
              "x-api-key":_this.model.get('token')
            },
            url: "https://api.newrelic.com/application_dashboard/",
            success : function(response) {
              console.log(response.responseText);
              view.appendTemplate(response.responseText);
              _this.$el.html(view.el);
            }
          });

        }
    });
});
