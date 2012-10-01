define([
    'vendor/base',
    'views/widget-view',
    'text!templates/github.html.haml'
    ], function (BackboneSuperView, WidgetView, template) {
      return BackboneSuperView.extend({

        id: 'github-view',

      template: template,

      initialize: function (options) {
      },

      postRender: function () {
        this.githubView = new WidgetView({
          heading: 'Github',
        contentId: 'github-widget'
        }).render();
        this.githubView.append("<div class='github-widget' data-repo='" + githubUser + "/" + githubProject + "'>");
        this.$el.append(this.githubView.el);
      },

      github: function() {
        githubWidget();
      }
    });

  });
