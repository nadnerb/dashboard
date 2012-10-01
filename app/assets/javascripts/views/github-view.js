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
        this.githubView.append('<div id="loading-github"></div>');
        this.$el.append(this.githubView.el);
      },

      spinner: function () {
        if (this.githubView.$('#loading-github svg').length === 0) {
          spinner('loading-github', 50, 45, 15, 3, '#888');
        }
      },

      github: function() {
        githubWidget();
      }
    });

  });
