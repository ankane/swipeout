/*
 * SwipeOut
 * version 0.1.0
 * https://github.com/ankane/swipeout
 * Licensed under the MIT license.
 */

/*jslint browser: true, indent: 2 */
/*global Hammer*/

function SwipeOut(listEl, options) {
  'use strict';

  options = options || {};

  var swiped = false,
      preventSwipe = false,
      hammer = null,
      deleteBtn = document.createElement("div"),
      btnText = options.btnText || "Delete",
      keepOnDelete = options.keepOnDelete === true;

  // generic helpers

  // http://stackoverflow.com/questions/195951/change-an-elements-css-class-with-javascript
  function addClass(el, cssClass) {
    el.className += (" " + cssClass);
  }

  function removeElement(el) {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }

  function addCss(css) {
    var head = document.getElementsByTagName("head")[0],
      style = document.createElement("style");

    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
  }

  // custom helpers

  function findListItemNode(el) {
    var currentEl = el;
    while (currentEl && currentEl.parentNode !== listEl) {
      currentEl = currentEl.parentNode;
    }
    return currentEl;
  }

  function hideButton() {
    swiped = false;
    deleteBtn.style.opacity = 0;
    deleteBtn.style.webkitTransform = "translate3d(20px,0,0)";
  }

  function centerButton() {
    deleteBtn.style.top = ((findListItemNode(deleteBtn).offsetHeight - deleteBtn.offsetHeight) / 2) + "px";
  }

  function showButton() {
    centerButton();
    deleteBtn.style.opacity = 1;
    deleteBtn.style.webkitTransform = "translate3d(0,0,0)"; // use 3d for hardware acceleration
  }

  // events

  // trap click events on list when delete is shown
  // http://stackoverflow.com/questions/6157486/jquery-trap-all-click-events-before-they-happen
  function onClick(e) {
    if (swiped || preventSwipe) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (swiped && e.target === deleteBtn) {
      var li = findListItemNode(e.target),
        event = document.createEvent("Events");

      // must send event before removal from the dom
      event.initEvent("delete", true, true, null, null, null, null, null, null, null, null, null, null, null, null);
      li.dispatchEvent(event);

      if (!keepOnDelete) {
        removeElement(li);
      }

      hideButton();
    }
  }

  function onOrientationChange() {
    centerButton();
  }

  function onSwipe(e) {
    if (!preventSwipe) {
      if (swiped) {
        hideButton();
      } else {
        // add delete button
        swiped = true;
        var li = findListItemNode(e.target);
        removeElement(deleteBtn);
        li.appendChild(deleteBtn);
        showButton(deleteBtn);
      }
    }
  }

  // attach / detach events

  function attachEvents() {
    listEl.addEventListener("click", onClick, true);
    window.addEventListener("orientationchange", onOrientationChange, false);
    hammer = Hammer(listEl, {drag: false, hold: false, tap: false, touch: false, transform: false}).on('swipeleft swiperight', onSwipe);
  }

  function detachEvents() {
    removeElement(deleteBtn);
    hammer.off('swipeleft swiperight');
    window.removeEventListener("orientationchange", onOrientationChange, false);
    listEl.removeEventListener("click", onClick, true);
  }

  // add text
  deleteBtn.appendChild(document.createTextNode(btnText));

  // style button
  deleteBtn.style.position = "absolute";
  deleteBtn.style.right = "6px";
  deleteBtn.style.webkitTransition = "-webkit-transform 0.25s ease-in-out, opacity 0.25s ease-in-out";
  hideButton();
  addClass(deleteBtn, "delete-btn");

  // style list items
  // TODO insert only once per page and clean up
  addCss(".swipe-out > li { position: relative; }");

  // style list
  listEl.style.overflow = "hidden";
  addClass(listEl, "swipe-out");

  attachEvents();

  // public methods

  this.destroy = function () {
    detachEvents();
  };
}
