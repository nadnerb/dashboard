define([
    'backbone',
    'vendor/base',
    'models/last-failed',
    'text!templates/build.html.haml'
], function (Backbone, BackboneSuperView, LastFailed, template) {

    return BackboneSuperView.extend({

        className: 'build',

        template: template,

        events: {
            'click .build-now': 'buildNow'
        },

        postRender: function () {
            if (this.model.isCurrentlyFailing()) {
                var lastFailed = new LastFailed({displayName: this.model.get('displayName')});

                lastFailed.on('change', function () {
                    var theBreaker = lastFailed.theBreaker();
                    if (theBreaker === '') {
                        var message = 'Not sure who did it';
                    } else {
                        var message = 'Chase down: ' + theBreaker;    
                    }
                    
                    this.$('.build-' + this.model.get('color') + ' a').attr({
                        'data-title': 'Broken Build',
                        'data-content': message
                    }).popover({
                        trigger: 'hover'
                    });
                }, this);

                lastFailed.fetch();
            }
        },

        renderSpinner: function () {
            if (this.model.get('color').indexOf('anim') !== -1) {
                if (this.$('.spinner svg').length === 0) {
                    spinner('spinner-' + this.model.get('displayName'), 16, 15, 15, 3, '#fff');
                }
            } else {
                this.$('.spinner').empty();
            }
        },

        update: function (model) {
            this.model = model;
            if (this.$('.build-' + this.model.get('color')).length === 0) {
                this.$('.build-button')
                    .removeClass('build-blue')
                    .removeClass('build-blue_anime')
                    .removeClass('build-red')
                    .removeClass('build-red_anime')
                    .removeClass('build-grey')
                    .removeClass('build-grey_anime')
                    .addClass('build-' + model.get('color'));
            }

            this.renderSpinner();
        },

        buildNow: function (event) {
            var BuildNow = Backbone.Model.extend({
                url: $(event.currentTarget).attr('href'),
                sync: function(method, model, options) {  
                    options.dataType = 'jsonp';  
                    options.jsonp = 'jsonp';
                    return Backbone.sync(method, model, options);  
                } 
            });

            new BuildNow().save();
            return false;
        }
    });
});