$(document).ready(function () {

    $('#create-another-link').live('click', function () {
        $.removeCookie('project_data');
        $.removeCookie('project_id');
        $.removeCookie('project_token');
        window.refresh();
    });

    var getSuccess = function(response) {
        if (response.status === 'CREATE_COMPLETE') {
            $('#loading-image').remove();
            $('#please-wait').remove();
            $('#waiting .page-container').append('<h2>Your environment is ready for action</h2><h1><a href="' + response.output.value + '" target="_blank">' + response.output.value + '</a></h1>');
            $('#waiting .page-container').append('<p>Done with this environment? <a id="create-another-link" href="">Create another</a></p>');
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
        $('#nav-region-selected').html('<button class="btn btn-info">' + data.project.region + '</button>');

        return;
    }

    $.scrollingWizard({ 
        steps: [{
            id: '#page1',
            validation: function () {
                var text = $('#application-name').val().replace(/[^a-z0-9_\s]/gi, '').replace(/[\s]/g, '-');

                if (text === '') {
                    return null;
                }

                $('b.url').html(text);

                $('#page1 .btn').removeClass('btn-success').addClass('btn-primary').html('<i class="icon-arrow-down icon-white"></i>Update application name');

                $('#summary-application-name').text(text);

                $.cookie('project_token', $('#application-token').val(), {path: '/', expires: 365});
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
            id: '#aws-details',
            validation: function () {
                var account = "Default";
                if ($('#aws-access-key-id').val().length > 0) {
                  account = $('#aws-access-key-id').val();
                }
                $('#summary-aws-account').text(account);
                return account;
            }
        },{
            id: '#page2',
            validation: function () {
                $('#summary-technology-stack').text($('#tech-stack').selectableGrid().selected().text().trim());

                return $('#tech-stack').selectableGrid().selected().text().trim() || null;
            }
        },
        {
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
        },{
            id: '#region',
            validation: function () {
                $('#summary-aws-region').text($('#aws-region').val());
                return $('#aws-region').val();
            }
        }], 
        finished: function () {
            var applicationName = $('#application-name').val().replace(/[^a-z0-9_\s]/gi, '').replace(/[\s]/g, '-');
            var data = {project: {
                name: applicationName,
                token: $('#application-token').val(),
                github_account: $('#github-account').val(),
                github_project: applicationName,
                github_private: $('#github-private').is(':checked'),
                tech_stack: $('#tech-stack').selectableGrid().selected().text().trim(),
                region: $('#aws-region').val(),
                aws: {
                  accessKey: $("#aws-access-key-id").val(),
                  secretAccessKey: $("#aws-secret-access-key").val(),
                  privateKey: $("#aws-private-key").val()
                }
            }};

            $.cookie('project_data', JSON.stringify(data), {expires: 365});

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
        }
    });
});
