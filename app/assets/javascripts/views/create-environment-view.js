define([
    'views/modal-view',
    'models/stack',
    'collections/stack-templates',
    'models/stack-template',
    'text!templates/stack-templates.html.haml',
    'text!templates/create-environment-form-field.html.haml',
    'text!templates/create-environment-form.html.haml'
], function (ModalView, Stack, StackTemplates, StackTemplate, stackTemplatesTemplate, formFieldTemplate, template) {
    return ModalView.extend({
        template: template,

        events: {
            'click .cancel': 'hide',
            'click .confirm': 'confirm'
        },

        initialize: function (options) {
            ModalView.prototype.initialize.call(this);

            this.model = new Stack({random: this.random});
            this.bindTo(this.model, 'change', function () {
                this.populateForm();
            });

            this.stackTemplates = new StackTemplates();
            this.bindTo(this.stackTemplates, 'reset', function () {
                this.renderStackTemplates();
            });
            this.stackTemplates.fetch();
        },

        renderStackTemplates: function () {
            var markup = haml.compileHaml({source: stackTemplatesTemplate})({ stackTemplates: this.stackTemplates.toJSON() });
            this.$('.form-horizontal').html(markup);
            this.fadeIn();
        },

        renderFormFromTemplate: function () {
            this.$('.form-horizontal').empty();
            _(this.stackTemplate.get('parameters')).each(function (parameter) {
                var formField = haml.compileHaml({source: formFieldTemplate})(parameter);
                this.$('.form-horizontal').append(formField);
            }, this);

            if (this.model.isNew()) {
                this.fadeIn();
                this.$('#EnvironmentName').val(this.options.name);
            }
        },

        fadeIn: function () {
            this.$('#loading-fields-' + this.random).fadeOut();
            this.$('.form-horizontal').css('visibility', 'visible').fadeIn();
        },

        fadeOut: function () {
            this.spinner();
            this.$('#loading-fields-' + this.random).fadeIn();
            this.$('.form-horizontal').css('visibility', 'visible').fadeOut();
        },

        populateForm: function () {
            _(this.model.get('parameters')).each(function (value, key) {
                this.$('#' + key).val(value);
            }, this);  

            this.fadeIn();
        },

        confirm: function () {
            if (this.stackTemplate === undefined) {
                this.stackTemplate = new StackTemplate({ id: this.$('#stack-templates').val() });
                this.bindTo(this.stackTemplate, 'change', function () {
                    this.renderFormFromTemplate();
                });
                this.stackTemplate.fetch();
                this.fadeOut();
            } else {
                var attrs = {};
                _(this.stackTemplate.get('parameters')).each(function (parameter) {
                    attrs[parameter.parameter_key] = this.$('#'+ parameter.parameter_key).val();
                }, this);

                // this.model.save(attrs);
            }

            return false;
        }
    });
});