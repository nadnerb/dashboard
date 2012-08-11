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
        id: '#summary',
        validation: function () {
            return true;
        }
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
            url: '/launchpad/launch',
            contentType: "application/json",
            data: JSON.stringify(data)
        });
    });
});

$(document).ready(function () {
    var paper = Raphael('nav-source-image', 60, 50);
    paper.path('M28.436,15.099c-1.201-0.202-2.451-0.335-3.466-0.371l-0.179-0.006c0.041-0.09,0.072-0.151,0.082-0.16c0.022-0.018,0.04-0.094,0.042-0.168c0-0.041,0.018-0.174,0.046-0.35c0.275,0.01,0.64,0.018,1.038,0.021c1.537,0.012,3.145,0.136,4.248,0.331c0.657,0.116,0.874,0.112,0.389-0.006c-0.491-0.119-1.947-0.294-3.107-0.37c-0.779-0.053-1.896-0.073-2.554-0.062c0.019-0.114,0.041-0.241,0.064-0.371c0.093-0.503,0.124-1.009,0.126-2.016c0.002-1.562-0.082-1.992-0.591-3.025c-0.207-0.422-0.441-0.78-0.724-1.104c0.247-0.729,0.241-1.858-0.015-2.848c-0.211-0.812-0.285-0.864-1.021-0.708C22.19,4.019,21.69,4.2,21.049,4.523c-0.303,0.153-0.721,0.391-1.024,0.578c-0.79-0.278-1.607-0.462-2.479-0.561c-0.884-0.1-3.051-0.044-3.82,0.098c-0.752,0.139-1.429,0.309-2.042,0.511c-0.306-0.189-0.75-0.444-1.067-0.604C9.973,4.221,9.473,4.041,8.847,3.908c-0.734-0.157-0.81-0.104-1.02,0.708c-0.26,1.003-0.262,2.151-0.005,2.878C7.852,7.577,7.87,7.636,7.877,7.682c-1.042,1.312-1.382,2.78-1.156,4.829c0.059,0.534,0.15,1.024,0.277,1.473c-0.665-0.004-1.611,0.02-2.294,0.064c-1.162,0.077-2.618,0.25-3.109,0.369c-0.484,0.118-0.269,0.122,0.389,0.007c1.103-0.194,2.712-0.32,4.248-0.331c0.29-0.001,0.561-0.007,0.794-0.013c0.07,0.237,0.15,0.463,0.241,0.678L7.26,14.759c-1.015,0.035-2.264,0.168-3.465,0.37c-0.901,0.151-2.231,0.453-2.386,0.54c-0.163,0.091-0.03,0.071,0.668-0.106c1.273-0.322,2.928-0.569,4.978-0.741l0.229-0.02c0.44,1.022,1.118,1.802,2.076,2.41c0.586,0.373,1.525,0.756,1.998,0.816c0.13,0.016,0.508,0.094,0.84,0.172c0.333,0.078,0.984,0.195,1.446,0.262h0.011c-0.009,0.006-0.017,0.01-0.025,0.016c-0.56,0.291-0.924,0.744-1.169,1.457c-0.11,0.033-0.247,0.078-0.395,0.129c-0.529,0.18-0.735,0.217-1.271,0.221c-0.556,0.004-0.688-0.02-1.02-0.176c-0.483-0.225-0.933-0.639-1.233-1.133c-0.501-0.826-1.367-1.41-2.089-1.41c-0.617,0-0.734,0.25-0.288,0.615c0.672,0.549,1.174,1.109,1.38,1.537c0.116,0.24,0.294,0.611,0.397,0.824c0.109,0.227,0.342,0.535,0.564,0.748c0.522,0.498,1.026,0.736,1.778,0.848c0.504,0.074,0.628,0.074,1.223-0.002c0.287-0.035,0.529-0.076,0.746-0.127c0,0.244,0,0.525,0,0.855c0,1.766-0.021,2.334-0.091,2.5c-0.132,0.316-0.428,0.641-0.716,0.787c-0.287,0.146-0.376,0.307-0.255,0.455c0.067,0.08,0.196,0.094,0.629,0.066c0.822-0.051,1.403-0.355,1.699-0.891c0.095-0.172,0.117-0.518,0.147-2.318c0.032-1.953,0.046-2.141,0.173-2.42c0.077-0.166,0.188-0.346,0.25-0.395c0.104-0.086,0.111,0.084,0.111,2.42c-0.001,2.578-0.027,2.889-0.285,3.385c-0.058,0.113-0.168,0.26-0.245,0.33c-0.135,0.123-0.192,0.438-0.098,0.533c0.155,0.154,0.932-0.088,1.356-0.422c0.722-0.572,0.808-1.045,0.814-4.461l0.003-2.004l0.219,0.021l0.219,0.02l0.036,2.621c0.041,2.951,0.047,2.994,0.549,3.564c0.285,0.322,0.572,0.5,1.039,0.639c0.625,0.188,0.813-0.102,0.393-0.605c-0.457-0.547-0.479-0.756-0.454-3.994c0.017-2.076,0.017-2.076,0.151-1.955c0.282,0.256,0.336,0.676,0.336,2.623c0,2.418,0.069,2.648,0.923,3.07c0.399,0.195,0.511,0.219,1.022,0.221c0.544,0.002,0.577-0.006,0.597-0.148c0.017-0.115-0.05-0.193-0.304-0.348c-0.333-0.205-0.564-0.467-0.709-0.797c-0.055-0.127-0.092-0.959-0.117-2.672c-0.036-2.393-0.044-2.502-0.193-2.877c-0.201-0.504-0.508-0.902-0.897-1.166c-0.101-0.066-0.202-0.121-0.333-0.162c0.161-0.016,0.317-0.033,0.468-0.055c1.572-0.209,2.403-0.383,3.07-0.641c1.411-0.543,2.365-1.445,2.882-2.724c0.046-0.114,0.092-0.222,0.131-0.309l0.398,0.033c2.051,0.173,3.706,0.42,4.979,0.743c0.698,0.177,0.831,0.198,0.668,0.105C30.666,15.551,29.336,15.25,28.436,15.099zM22.422,15.068c-0.233,0.512-0.883,1.17-1.408,1.428c-0.518,0.256-1.33,0.451-2.25,0.544c-0.629,0.064-4.137,0.083-4.716,0.026c-1.917-0.188-2.991-0.557-3.783-1.296c-0.75-0.702-1.1-1.655-1.039-2.828c0.039-0.734,0.216-1.195,0.679-1.755c0.421-0.51,0.864-0.825,1.386-0.985c0.437-0.134,1.778-0.146,3.581-0.03c0.797,0.051,1.456,0.051,2.252,0c1.886-0.119,3.145-0.106,3.61,0.038c0.731,0.226,1.397,0.834,1.797,1.644c0.18,0.362,0.215,0.516,0.241,1.075C22.808,13.699,22.675,14.517,22.422,15.068zM12.912,11.762c-1.073-0.188-1.686,1.649-0.863,2.587c0.391,0.445,0.738,0.518,1.172,0.248c0.402-0.251,0.62-0.72,0.62-1.328C13.841,12.458,13.472,11.862,12.912,11.762zM19.425,11.872c-1.073-0.188-1.687,1.647-0.864,2.586c0.392,0.445,0.738,0.519,1.173,0.247c0.401-0.25,0.62-0.72,0.62-1.328C20.354,12.569,19.985,11.971,19.425,11.872zM16.539,15.484c-0.023,0.074-0.135,0.184-0.248,0.243c-0.286,0.147-0.492,0.096-0.794-0.179c-0.187-0.169-0.272-0.258-0.329-0.081c-0.053,0.164,0.28,0.493,0.537,0.594c0.236,0.094,0.405,0.097,0.661-0.01c0.254-0.106,0.476-0.391,0.476-0.576C16.842,15.303,16.595,15.311,16.539,15.484zM16.222,14.909c0.163-0.144,0.2-0.44,0.044-0.597s-0.473-0.133-0.597,0.043c-0.144,0.206-0.067,0.363,0.036,0.53C15.865,15.009,16.08,15.034,16.222,14.909z').attr({fill: "#999", stroke: "none"}).transform('t15,15s1.8');

    paper = Raphael('nav-source-performance', 60, 50);
    paper.path('M21.25,8.375V28h6.5V8.375H21.25zM12.25,28h6.5V4.125h-6.5V28zM3.25,28h6.5V12.625h-6.5V28z').attr({fill: "#999", stroke: "none"}).transform('t15,15s1.8');

    paper = Raphael('nav-source-build', 60, 50);
    paper.path('M17.41,20.395l-0.778-2.723c0.228-0.2,0.442-0.414,0.644-0.643l2.721,0.778c0.287-0.418,0.534-0.862,0.755-1.323l-2.025-1.96c0.097-0.288,0.181-0.581,0.241-0.883l2.729-0.684c0.02-0.252,0.039-0.505,0.039-0.763s-0.02-0.51-0.039-0.762l-2.729-0.684c-0.061-0.302-0.145-0.595-0.241-0.883l2.026-1.96c-0.222-0.46-0.469-0.905-0.756-1.323l-2.721,0.777c-0.201-0.228-0.416-0.442-0.644-0.643l0.778-2.722c-0.418-0.286-0.863-0.534-1.324-0.755l-1.96,2.026c-0.287-0.097-0.581-0.18-0.883-0.241l-0.683-2.73c-0.253-0.019-0.505-0.039-0.763-0.039s-0.51,0.02-0.762,0.039l-0.684,2.73c-0.302,0.061-0.595,0.144-0.883,0.241l-1.96-2.026C7.048,3.463,6.604,3.71,6.186,3.997l0.778,2.722C6.736,6.919,6.521,7.134,6.321,7.361L3.599,6.583C3.312,7.001,3.065,7.446,2.844,7.907l2.026,1.96c-0.096,0.288-0.18,0.581-0.241,0.883l-2.73,0.684c-0.019,0.252-0.039,0.505-0.039,0.762s0.02,0.51,0.039,0.763l2.73,0.684c0.061,0.302,0.145,0.595,0.241,0.883l-2.026,1.96c0.221,0.46,0.468,0.905,0.755,1.323l2.722-0.778c0.2,0.229,0.415,0.442,0.643,0.643l-0.778,2.723c0.418,0.286,0.863,0.533,1.323,0.755l1.96-2.026c0.288,0.097,0.581,0.181,0.883,0.241l0.684,2.729c0.252,0.02,0.505,0.039,0.763,0.039s0.51-0.02,0.763-0.039l0.683-2.729c0.302-0.061,0.596-0.145,0.883-0.241l1.96,2.026C16.547,20.928,16.992,20.681,17.41,20.395zM11.798,15.594c-1.877,0-3.399-1.522-3.399-3.399s1.522-3.398,3.399-3.398s3.398,1.521,3.398,3.398S13.675,15.594,11.798,15.594zM27.29,22.699c0.019-0.547-0.06-1.104-0.23-1.654l1.244-1.773c-0.188-0.35-0.4-0.682-0.641-0.984l-2.122,0.445c-0.428-0.364-0.915-0.648-1.436-0.851l-0.611-2.079c-0.386-0.068-0.777-0.105-1.173-0.106l-0.974,1.936c-0.279,0.054-0.558,0.128-0.832,0.233c-0.257,0.098-0.497,0.22-0.727,0.353L17.782,17.4c-0.297,0.262-0.568,0.545-0.813,0.852l0.907,1.968c-0.259,0.495-0.437,1.028-0.519,1.585l-1.891,1.06c0.019,0.388,0.076,0.776,0.164,1.165l2.104,0.519c0.231,0.524,0.541,0.993,0.916,1.393l-0.352,2.138c0.32,0.23,0.66,0.428,1.013,0.6l1.715-1.32c0.536,0.141,1.097,0.195,1.662,0.15l1.452,1.607c0.2-0.057,0.399-0.118,0.596-0.193c0.175-0.066,0.34-0.144,0.505-0.223l0.037-2.165c0.455-0.339,0.843-0.747,1.152-1.206l2.161-0.134c0.152-0.359,0.279-0.732,0.368-1.115L27.29,22.699zM23.127,24.706c-1.201,0.458-2.545-0.144-3.004-1.345s0.143-2.546,1.344-3.005c1.201-0.458,2.547,0.144,3.006,1.345C24.931,22.902,24.328,24.247,23.127,24.706z').attr({fill: "#999", stroke: "none"}).transform('t15,15s1.5');

    paper = Raphael('nav-source-configure', 60, 50);
    paper.path('M24.946,9.721l-2.872-0.768l-0.771-2.874l3.188-3.231c-1.992-0.653-4.268-0.192-5.848,1.391c-1.668,1.668-2.095,4.111-1.279,6.172l-3.476,3.478l-3.478,3.478c-2.062-0.816-4.504-0.391-6.173,1.277c-1.583,1.581-2.043,3.856-1.39,5.849l3.231-3.188l2.874,0.77l0.769,2.872l-3.239,3.197c1.998,0.665,4.288,0.207,5.876-1.384c1.678-1.678,2.1-4.133,1.271-6.202l3.463-3.464l3.464-3.463c2.069,0.828,4.523,0.406,6.202-1.272c1.592-1.589,2.049-3.878,1.384-5.876L24.946,9.721z').attr({fill: "#999", stroke: "none"}).transform('t15,15s1.5');

    paper = Raphael('nav-source-dashboard', 60, 50);
    paper.path('M27.812,16l-3.062-3.062V5.625h-2.625v4.688L16,4.188L4.188,16L7,15.933v11.942h17.875V16H27.812zM16,26.167h-5.833v-7H16V26.167zM21.667,23.167h-3.833v-4.042h3.833V23.167z').attr({fill: "#999", stroke: "none"}).transform('t15,15s1.8');
});