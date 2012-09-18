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

            this.model = new Stack();
            this.bindTo(this.model, 'change', function () {
                if (!this.stackTemplate) {
                    this.stackTemplate = new StackTemplate({ id: this.model.get('template_name') });
                    this.bindTo(this.stackTemplate, 'change', function () {
                        this.renderFormFromTemplate();
                        this.populateForm();
                    });
                    this.stackTemplate.fetch();
                }
            });

            this.bindTo(this.model, 'error', function (model, errors) {
                this.populateFormWithErrors(errors);
            });

            if (options && options.name !== undefined) {
                this.stackTemplates = new StackTemplates();
                this.bindTo(this.stackTemplates, 'reset', function () {
                    this.renderStackTemplates();
                });
                this.stackTemplates.fetch();
            }
        },

        serialize: function () {
            return {
                model: this.model,
                random: this.random
            }
        },

        renderStackTemplates: function () {
            var markup = haml.compileHaml({source: stackTemplatesTemplate})({ stackTemplates: this.stackTemplates.toJSON() });
            this.$('.form-horizontal').html(markup);
            this.fadeIn();
        },

        renderFormFromTemplate: function () {
            this.$('.form-horizontal').empty();

            // if (this.options.name === undefined) { // yeh...i know...
            //     this.options.name = 'dev'
            // }

            if (this.options.name === 'dev') { 
                var formField = haml.compileHaml({source: formFieldTemplate})({
                    parameter_key: 'UniqueName',
                    description: 'Unique name'
                });
                this.$('.form-horizontal').append(formField);
            }

            if (!this.model.isNew()) {
                var formField = haml.compileHaml({source: formFieldTemplate})({
                    parameter_key: 'TemplateName'
                });
                this.$('.form-horizontal').append(formField);
            }

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
            this.$('#TemplateName').val(this.model.get('template_name'));

            _(this.model.get('parameters')).each(function (value, key) {
                this.$('#' + key).val(value);
            }, this);  

            this.fadeIn();
        },

        populateFormWithErrors: function (errors) {
            this.$('.control-group').removeClass('error');
            this.$('.control-group .controls .help-inline').remove();

            _(errors).each(function (error) {
                var $controlGroup = this.$('#' + error).closest('.control-group');
                $controlGroup.addClass('error');
                $controlGroup.find('.controls').append(this.make('span', {'class': 'help-inline'}, 'Required')); 
            }, this);
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

                if (this.$('#UniqueName').length !== 0) {
                    attrs['UniqueName'] = this.$('#UniqueName').val();
                }

                this.model.save(attrs);
            }

            return false;
        }
    });
});