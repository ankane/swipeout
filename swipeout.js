/*
 * SwipeOut
 * version 0.2.0
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
    touchable = "ontouchstart" in window;

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

  function transform(style) {
    deleteBtn.style.transform = style;
    deleteBtn.style.webkitTransform = style;
    deleteBtn.style.mozTransform = style;
    deleteBtn.style.oTransform = style;
  }

  function hideButton() {
    swiped = false;
    deleteBtn.style.opacity = 0;
    transform("translate3d(20px,0,0)"); // use 3d for hardware acceleration
  }

  function centerButton() {
    deleteBtn.style.top = ((findListItemNode(deleteBtn).offsetHeight - deleteBtn.offsetHeight) / 2) + "px";
  }

  function showButton() {
    centerButton();
    deleteBtn.style.opacity = 1;
    transform("translate3d(0,0,0)");
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

      removeElement(li);
      hideButton();
    }
  }

  function onTouchStart(e) {
    preventSwipe = false;
    if (swiped && e.target !== deleteBtn) {
      e.preventDefault();
      e.stopPropagation();
      hideButton();
      preventSwipe = true;
    }
  }

  function onOrientationChange() {
    centerButton();
  }

  function onDragStart(e) {
    var direction = e.gesture.direction;
    if (direction == Hammer.DIRECTION_LEFT || direction == Hammer.DIRECTION_RIGHT) {
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
  }

  // attach / detach events

  function attachEvents() {
    listEl.addEventListener("click", onClick, true);
    if (touchable) {
      listEl.addEventListener("touchstart", onTouchStart, false);
    } else {
      listEl.addEventListener("mousedown", onTouchStart, false);
    }
    window.addEventListener("orientationchange", onOrientationChange, false);
    hammer = Hammer(listEl).on("dragstart", onDragStart);
  }

  function detachEvents() {
    removeElement(deleteBtn);
    hammer.off("dragstart");
    window.removeEventListener("orientationchange", onOrientationChange, false);
    if (touchable) {
      listEl.removeEventListener("touchstart", onTouchStart, false);
    } else {
      listEl.removeEventListener("mousedown", onTouchStart, false);
    }
    listEl.removeEventListener("click", onClick, true);
  }

  // add text
  deleteBtn.appendChild(document.createTextNode(btnText));

  // style button
  deleteBtn.style.position = "absolute";
  deleteBtn.style.right = "6px";
  deleteBtn.style.transition = "transform 0.25s ease-in-out, opacity 0.25s ease-in-out";
  deleteBtn.style.webkitTransition = "-webkit-transform 0.25s ease-in-out, opacity 0.25s ease-in-out";
  deleteBtn.style.mozTransition = "-moz-transform 0.25s ease-in-out, opacity 0.25s ease-in-out";
  deleteBtn.style.oTransition = "-o-transform 0.25s ease-in-out, opacity 0.25s ease-in-out";
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
