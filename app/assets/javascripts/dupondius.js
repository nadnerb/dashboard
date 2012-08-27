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
    var getSuccess = function(response) {
        if (response.status === 'CREATE_COMPLETE') {
            $('#loading-image').remove();
            $('#please-wait').remove();
            $('#waiting .page-container').append('<h2>Your environment is ready for action</h2><a href="' + response.output.value + '">' + response.output.value + '</a>');
            return;
        } else {
          setTimeout(function () {
            $.ajax({
              type: 'GET',
              url: '/projects/' + response.id,
              contentType: "application/json",
              success: getSuccess
            });
         }, 50000);
        }
    };

    var inifiniteCheck = function (projectId) {
        $.ajax({
            type: 'GET',
            url: '/projects/' + projectId,
            contentType: "application/json",
            success:  getSuccess
        });

        $('#please-wait').append('<div id="loading-image"><img src="/assets/ajax-loading.gif" alt="Loading..." /></div>');
    };

    // recover from page refresh?
    if ($.cookie('project_id') !== null) {
        // show to last step
        $('#page1').addClass('hidden');
        $('#waiting').removeClass('hidden');
        inifiniteCheck($.cookie('project_id'));

        var data = JSON.parse($.cookie('project_data'));

        $('#nav-application-name').html('<button class="btn btn-info">' + data.project.name + '</button>');
        $('#nav-application-stack').html('<button class="btn btn-info">' + data.project.tech_stack + '</button>');
        $('#nav-application-support').html('<button class="btn btn-info">' + data.project.support.join(', ') + '</button>');
        $('#nav-application-envs').html('<button class="btn btn-info">' + data.project.environments.join(', ') + '</button>');

        return;
    }

    $.scrollingWizard([{
        id: '#page1',
        validation: function () {
            var text = $('#application-name').val();

            if (text === '') {
                return null;
            }

            $('b.url').html(text);

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
        }
    },{
        id: '#summary',
        validation: function () {
            return true;
        },
        finish: true
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

        var data = {project: {
            name: $('#application-name').val(),
            token: $('#application-token').val(),
            github: $('#application-name').val().replace(/[^\w\s]/gi, '').replace(/ /g, '_'),
            tech_stack: $('#tech-stack').selectableGrid().selected().text().trim(),
            support: support,
            environments: environments
        }};

        $.cookie('project_data', JSON.stringify(data));

        var postSuccess = function(response) {
            $.cookie('project_id', response.id, {expires: 365});
            inifiniteCheck(response.id);
        };

        $.ajax({
            type: 'POST',
            url: '/projects',
            contentType: "application/json",
            data: JSON.stringify(data),
           success: postSuccess
        });
    });
});
