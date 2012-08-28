define([
    'vendor/base',
    'text!templates/performance.html.haml'
], function (BackboneSuperView, template) {
    return BackboneSuperView.extend({

        id: 'performance',

        template: template

    });
});
