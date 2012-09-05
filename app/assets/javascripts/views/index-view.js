define([
    'views/widget-view',
    'text!templates/index.html.haml',
    'collections/ec2-instances'
], function (WidgetView, template, InstancesCollection) {
    return WidgetView.extend({

      id: 'index-view',

      template: template,

      initialize: function (options) {
          this.collection = new InstancesCollection();
          this.bindTo(this.collection, 'reset', function () {
              this.renderEnvironment();
          });
          WidgetView.prototype.initialize.call(this, {heading: 'Your Environment'});
      },

      postRender: function () {
          WidgetView.prototype.postRender.call(this);
//          spinner('spinner', 16, 15, 15, 3, '#fff');
          this.collection.fetch();
      },

      renderEnvironment: function () {
          this.collection.each(function (instance) {
            this.$('.widget-content ul').append("<li>" + instance.get('name') + " (" + instance.get('instance_name') + ")</li>");
            this.$('.widget-content .accordion').append(
              '<div class="accordion-group">' +
                  '<div class="accordion-heading">' +
                    '<a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#' + instance.get('id') + '">' +
                      instance.get('name') +
                    '</a>' +
                  '</div>' +
                  '<div id="' + instance.get('id') + '" class="accordion-body collapse">' +
                    '<div class="accordion-inner">' +
                      instance.get('instance_name') +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>');
          });
      },

      destroy: function () {
          WidgetView.prototype.destroy.call(this);
      }

    });
});