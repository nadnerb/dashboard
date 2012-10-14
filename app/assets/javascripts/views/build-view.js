define([
    'backbone',
    'models/last-failed',
    'text!templates/build.html.haml',
    'libs/bootstrap'
], function (Backbone, LastFailed, template) {

    return Backbone.SuperView.extend({

        className: 'build',

        template: template,

        events: {
            'click .build-now': 'buildNow'
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

        postRender: function () {
            this.renderQueued();
        },

        renderQueued: function () {
            if (this.model.get('inQueue') === true) {
                if (this.$('.build-now .queued').length === 0) {
                    this.$('.build-now i').hide();
                    this.$('.build-now').append(this.make('span', {class: 'queued'}, 'Queued'));
                }
            } else {
                this.$('.build-now i').show();
                this.$('.build-now .queued').remove();
            }
        },

        update: function (model) {
            this.model = model;
            if (this.$('.build-' + this.model.get('color')).length === 0) {
                this.$('.build-button')
                    .removeClass('build-blue build-blue_anime build-red build-red_anime build-grey build-grey_anime')
                    .addClass('build-' + model.get('color'));
            }

            this.renderQueued();

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
            } else {
                this.$('.build-' + this.model.get('color') + ' a').removeAttr('data-title').removeAttr('data-content');
            }

            this.renderSpinner();
        },

        buildNow: function (event) {
            if (this.model.get('inQueue') === true) {
                return false;
            }

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