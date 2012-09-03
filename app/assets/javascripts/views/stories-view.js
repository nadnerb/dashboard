define([
    'vendor/base',
    'models/iteration',
    'views/widget-view',
    'text!templates/configure-pivotal.html.haml'
], function (BackboneSuperView, Iteration, WidgetView, configurePivotalTemplate) {
    return BackboneSuperView.extend({

        id: 'stories',

        events: {
            'click .btn': 'configurePivotalTracker'
        },

        initialize: function (options) {
            this.model = new Iteration();
            this.model.on('change', function () {
                this.render();
            }, this);
        },

        postRender: function () {
            if (this.model.has('stories')) {
                this.renderBurnDownChart();
            } else {
                this.renderConfigurePivotalTracker();
            }
        },

        renderBurnDownChart: function () {
            var view = new WidgetView({
                 heading: 'Burn Down Chart',
                 contentId: 'burn-down-widget'
            }).render();
            this.$el.html(view.el);
            this.renderLineGraph(view);
        },

        renderConfigurePivotalTracker: function () {
            var view = new WidgetView({
               heading: 'Configure Pivotal Tracker',
               contentId: 'configure-pivotal-tracker-widget'
            }).render();

            if (this.model.has('not_configured')) {
                view.appendTemplate(configurePivotalTemplate);    
            } else {
                view.append('Loading...');
            }

            this.$el.html(view.el);
        },

        configurePivotalTracker: function () {
            var token = this.$('#pivotal-tracker-token').val();
            var projectId = this.$('#pivotal-tracker-project').val();

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
                project_id: projectId
            });

            return false;
        },

        renderLineGraph: function (view) {
            renderLineGraph({
                elementId: view.options.contentId,
                labels: this.model.burnDownDates(),
                values: this.model.burnDownValues(),
                width: Math.min(this.$el.width(), 900),
                height: 250
            });
        }
    });
});