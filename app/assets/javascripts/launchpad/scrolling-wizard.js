var ScrollingWizard;

ScrollingWizard = (function() {

  function ScrollingWizard(options) {
    var $id, scrollTo,
      _this = this;
    this.steps = options.steps;
    this.finished = options.finished;
    scrollTo = function(element, callback) {
      if (element.length === 0) {
        return;
      }
      element.removeClass('hidden');
      return $('html, body').animate({
        scrollTop: element.offset().top - $('.steps').offset().top
      }, 300, 'swing', callback);
    };
    $id = function(id) {
      return $('#' + id);
    };
    $('[data-navigate]').click(function(event) {
      var element;
      event.preventDefault();
      element = $(event.currentTarget);
      return scrollTo($id(element.data().navigate));
    });
    $(this.steps).each(function(index, step) {
      var $navigation, $step, $submit, data;
      $step = $(step.id);
      data = $step.data();
      $submit = $id(data.submit);
      $navigation = $id(data.navigation);
      step.nextStep = step.nextStep || function() {
        return data.next;
      };
      return $submit.click(function(event) {
        var $next, attr, value, _i, _len;
        event.preventDefault();
        $next = $id(step.nextStep());
        value = step.validation();
        if (value === null) {
          return;
        }
        $navigation.empty().append("<button class=\"btn btn-info\">" + value + "</button>");
        $navigation.find('button').click(function() {
          return scrollTo($step, step.focus);
        });
        if (step.finish === true) {
          _this.finished();
        }
        if ($next.hasClass('hidden')) {
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            attr = data[_i];
            if (attr === 'next') {
              $id(attr).addClass('hidden');
            }
          }
          $id($next.data().navigation).empty();
        }
        return scrollTo($next);
      });
    });
  }

  return ScrollingWizard;

})();

jQuery(function() {
  $.scrollingWizard = function(options) {
    var state;
    state = '';
    this.settings = {};
    this.setState = function(_state) {
      return state = _state;
    };
    this.getState = function() {
      return state;
    };
    this.getSetting = function(key) {
      return this.settings[key];
    };
    this.callSettingFunction = function(name, args) {
      if (args == null) {
        args = [];
      }
      return this.settings[name].apply(this, args);
    };
    this.init = function() {
      this.settings = $.extend({}, this.defaults, options);
      new ScrollingWizard(this.settings);
      return this.setState('ready');
    };
    this.init();
    return this;
  };
  $.scrollingWizard.prototype.defaults = {
    steps: [],
    finished: function() {}
  };
  return $.fn.scrollingWizard = function(options) {
    return this.each(function() {
      var plugin;
      if ($(this).data('scrollingWizard') === void 0) {
        plugin = new $.scrollingWizard(this, options);
        return $(this).data('scrollingWizard', plugin);
      }
    });
  };
});
