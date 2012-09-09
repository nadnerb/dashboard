define([
    'views/modal-view',
    'models/stack',
    'models/stack-template',
    'text!templates/create-environment-form-field.html.haml',
    'text!templates/create-environment-form.html.haml'
], function (ModalView, Stack, StackTemplate, formFieldTemplate, template) {
    return ModalView.extend({
        template: template,

        events: {
            'click .cancel': 'hide',
            'click .confirm': 'confirm'
        },

        initialize: function (options) {
            ModalView.prototype.initialize.call(this);

            this.model = new Stack();

            this.stackTemplate = new StackTemplate();
            this.bindTo(this.stackTemplate, 'change', function () {
                this.renderFormFromTemplate();
            });
            this.stackTemplate.fetch();
        },

        renderFormFromTemplate: function () {
            this.$('#loading-fields').empty();

            _(this.stackTemplate.get('parameters')).each(function (parameter) {
                var formField = haml.compileHaml({source: formFieldTemplate})(parameter);
                this.$('.form-horizontal').append(formField);
            }, this);
        },

        confirm: function () {
            var attrs = {};
            _(this.stackTemplate.get('parameters')).each(function (parameter) {
                attrs[parameter.parameter_key] = this.$('#'+ parameter.parameter_key).val();
            }, this);

            this.model.save(attrs);
            return false;
        }
    });
});