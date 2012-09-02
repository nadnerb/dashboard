define([
    'vendor/base',
    'models/performance',
    'views/widget-view',
    'text!templates/configure-newrelic.html.haml'
    //'text!templates/performance.html.haml'
], function (BackboneSuperView, Performance, WidgetView, template) {
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
                view.appendTemplate(template);
            } else {
                view.append('Loading...');
            }

            this.$el.html(view.el);
        },

        configure: function () {
            var token = this.$('#newrelic-token').val();

            this.model.unset('not_configured');
            this.model.save({
                token: token,
            });

            return false;
        },

        renderMetrics: function () {
        }
    });
});
