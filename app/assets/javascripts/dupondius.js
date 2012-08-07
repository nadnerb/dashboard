(function ($) {
    $.scrollingWizard = function (steps, finished) {
        //
        // Helpers 
        //

        // scroll to a step
        var scrollTo = function (element, callback) {
            if (element.length === 0) {
                return;
            }

            // essentially the margin-top on the .pages element. needed to anchor at the right point
            var wrapperOffset = $('.steps').offset();

            element.removeClass('hidden');
            $('html, body').animate({scrollTop: element.offset().top - wrapperOffset.top}, 300, 'swing', callback);    
        };

        // shortcut to find by id
        var $id = function (id) {
            return $('#' + id);
        };

        // any navigations within the steps need to work
        $('[data-navigate]').click(function (event) {
            event.preventDefault();
            scrollTo($id($(event.currentTarget).data().navigate));
        });

        //
        // Step Logic
        //
        $(steps).each(function (index, step) {
            var $step = $(step.id);
            var data = $step.data();
            var $submit = $id(data.submit);
            var $navigation = $id(data.navigation);

            // default the nextStep function if one is not provided
            step.nextStep = step.nextStep || function () {
                return data.next;
            };

            $submit.click(function (event) {
                event.preventDefault(); 

                var $next = $id(step.nextStep()),
                    value = step.validation();

                // validate the step
                if (value === null) {
                    return;
                }

                // update the navigation bar
                $navigation.empty().append('<button class="btn btn-info">' + value + '</button>');
                $navigation.find('button').click(function () {
                    scrollTo($step, step.focus);
                });

                // done, make sure the finished function is executed
                if (step.finish === true) {
                    finished();
                }

                // when the next step is not on the screen
                if ($next.hasClass('hidden')) {
                    // ensure every next step is hidden
                    for (var key in data) {
                        if (key.indexOf('next') === 0) {
                            $id(data[key]).addClass('hidden');
                        }
                    }

                    // clear the now stale navigation item
                    $id($next.data().navigation).empty();
                }

                // scroll to the next step
                scrollTo($next);
            });
        });
    };
})(jQuery);

$(document).ready(function () {
    if ($('.steps').length === 0) {
        return;
    }

    $('#github-copy').click(function (event) {
        event.preventDefault();
        // $('#github-ssh-key').clipboard();
    });

    $('#github-ssh-key').keydown(function (event) {
        event.preventDefault();
    }).contextmenu(function (event) {
        event.preventDefault();
    });

    $.scrollingWizard([{
        id: '#page1',
        validation: function () {
            var text = $('#application-name').val();

            if (text === '') {
                return null;
            } 

            $('p.url').html('https://github.com/DiUS/<b>' + text.replace(/[^\w\s]/gi, '').replace(/ /g, '_') + '</b>.git');

            $('#page1 .btn').removeClass('btn-success').addClass('btn-primary').html('<i class="icon-arrow-down icon-white"></i>Update application name');

            $('#summary-application-name').text(text);

            return text;
        },
        focus: function () {
            $('#application-name').focus();
        }
    },{
        id: '#github-details',
        validation: function () {
            return true;
        }
    },{
        id: '#page2',
        validation: function () {
            $('#summary-technology-stack').text($('#tech-stack').selectableGrid().selected().text().trim());

            return $('#tech-stack').selectableGrid().selected().text().trim() || null;
        }
    },{
        id: '#page4',
        validation: function () {
            var text = [];
            $('#support-technologies').selectableGrid().selected().each(function (index, element) {
                text.push($(element).text().trim());
            });

            if (text.length === 0) {
                return null;
            }

            $('#summary-support-technology').text(text.join(', '));

            return text.join(', ');
        }
    },{
        id: '#page5',
        validation: function () {
            var text = [];
            $('#envs').selectableGrid().selected().each(function (index, element) {
                text.push($(element).text().trim());
            });

            if (text.length === 0) {
                return null;
            }

            $('#summary-environments').text(text.join(', '));

            return text.join(', ');
        },
        finish: true
    },{
        id: '#summary'
    },{
        id: '#waiting',
        validation: function () {
            return true;
        }
    }], function () {
        var support = [];
        $('#support-technologies').selectableGrid().selected().each(function (index, element) {
            support.push($(element).text().trim());
        });

        var environments = [];
        $('#envs').selectableGrid().selected().each(function (index, element) {
            environments.push($(element).text().trim());
        });

        var data = {
            name: $('#application-name').val(),
            github: $('#application-name').val().replace(/[^\w\s]/gi, '').replace(/ /g, '_'),
            tech_stack: $('#tech-stack').selectableGrid().selected().text().trim(),
            support: support,
            environments: environments
        };

        $.ajax({
            type: 'PUT',
            url: 'start',
            contentType: "application/json",
            data: JSON.stringify(data)
        });
    });
});