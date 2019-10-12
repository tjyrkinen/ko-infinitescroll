(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(['knockout', 'jquery', 'lodash'], factory)
  } else if (typeof exports === 'object') {
    module.exports = factory(require('knockout'), require('jquery'), require('lodash'))
  } else {
    factory(window.ko, window.$, window._)
  }
}(function(ko, $, _) {
  'use strict'
  ko.bindingHandlers.infiniteScroll = {

    init: function(el, valueAccessor, allBindings, viewModel, context) {
      var handler, offset

      if (typeof valueAccessor() === 'function') {
        handler = valueAccessor()
        offset = 1500
      } else {
        handler = valueAccessor().handler
        offset = valueAccessor().offset
      }

      armTrigger()
      ko.utils.domNodeDisposal.addDisposeCallback(el, disarmTrigger)

      function triggerPoint() {
        return contentHeight() - offset
      }

      function contentHeight() {
        var total = 0;
        $(el.offsetParent).children().each(function () {
          total += $(this).outerHeight(true);
        })
        return total;
      }

      function scrolledDist() {
        const res = $(el.offsetParent).scrollTop() + $(el.offsetParent).height();
        return res;
      }

      function fireInfiniteScroll() {
        return scrolledDist() >= triggerPoint(el)
      }

      function handleScroll() {
        var promise

        if (!fireInfiniteScroll()) return

        promise = valueAccessor().call(context.$data)

        if (typeof promise !== 'undefined' && typeof promise.then === 'function') {
          disarmTrigger()
          promise.then(armTrigger)
        }
      }

      function armTrigger() {
        $(el.offsetParent).on('scroll.infinitescroll', _.throttle(handleScroll, 300))
        handleScroll();
      }

      function disarmTrigger() {
        $(el.offsetParent).off('scroll.infinitescroll')
      }
    }
  }

}))
