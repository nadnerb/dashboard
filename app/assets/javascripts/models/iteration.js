define([
    'backbone'
], function (Backbone) {
    var millisecondsInADay = 60 * 60 * 24 * 1000;

    return Backbone.Model.extend({
        url: 'dashboard/stories',

        burnDownValues: function () {
            var cummulatedPoints = [];
            var startDate = new Date(this.get('start'));
            var finishDate = new Date(this.get('finish'));            
            var numberOfDays = (finishDate - startDate) / millisecondsInADay;

            var today = new Date();
            today.setHours(startDate.getHours());
            today.setMinutes(startDate.getMinutes());
            today.setSeconds(startDate.getSeconds());

            if (today > startDate && today < finishDate) {
                numberOfDays = Math.floor((today - startDate) / millisecondsInADay) + 1; 
            }

            _(this.get('stories')).each(function (story) {
                var dayComplete = numberOfDays;
                if (story.accepted_at !== null) {
                    var dateAccepted = new Date(story.accepted_at);
                    dateAccepted.setHours(startDate.getHours());
                    dateAccepted.setMinutes(startDate.getMinutes());
                    dateAccepted.setSeconds(startDate.getSeconds());

                    dayComplete = (dateAccepted - startDate) / millisecondsInADay;
                }

                
                _(dayComplete).times(function (count) {
                    if (cummulatedPoints[count] === undefined) {
                        cummulatedPoints[count] = 0;
                    }
                    cummulatedPoints[count] += story.estimate;
                });
            });

            return cummulatedPoints;
        },

        burnDownDates: function () {
            var startDate = new Date(this.get('start'));
            var dates = [];
            dates.push(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
            for (var i = 1; i < 7; i++) {
                var nextDay = new Date(dates[i-1].getTime() + millisecondsInADay);
                dates.push(new Date(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate()));
            }
            return dates;
        }
    });
});