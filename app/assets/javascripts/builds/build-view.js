Dashboard.View.BuildView = Backbone.View.extend({

    className: 'builds',

    initialize: function () {
        this.collection.on('reset', function () {
            this.collection.pipeline();
            this.render();
        }, this);
    },

    render: function () {
        var html = [];
        html.push(this.renderHeading());

        if (this.collection.isEmpty()) {
            html.push('Negotiating with Jenkins...');
        } else {
            var build = this.collection.firstInPipeline;
            html.push('<div class="build-pipeline">');
            html.push(this.renderBuild(build));

            while (build.hasNext()) {
                html.push(this.renderBuild(build.next));
                build = build.next;
            }            
            html.push('</div>');
        }
        this.$el.html(html.join(''));
        $('.row-fluid > div').append(this.el);
    },

    renderHeading: function () {
        return '<div><a target="_blank" href="http://ci.dupondi.us:8080">All builds can be found here</a></div>';
    },

    renderBuild: function (build) {
        return '<div class="build build-' + build.get('color') + '">' + 
                '<h2 class="build-heading"><a target="_blank" href="' + build.get('url') + '">' + 
                build.get('displayName') + 
                '</a></h2>' + 
                '</div>';
    }
});

var collection = new Dashboard.Collection.Builds();
var view = new Dashboard.View.BuildView({collection: collection});
view.render();
collection.fetch();