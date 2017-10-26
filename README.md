# SwipeOut

:surfer: Swipe-to-delete goodness for the mobile web

[View demo](http://ankane.github.com/swipeout/demo.html)

:tangerine: Battle-tested at [Instacart](https://www.instacart.com/opensource)

## Usage

### It’s easy to get started

Instantiate SwipeOut on a `<ul>` or `<ol>` element.

```javascript
var list = document.getElementById("list");
new SwipeOut(list);
```

When an item is deleted, a `delete` event is fired.

#### Javascript

```javascript
list.addEventListener("delete", function(evt) {
  // do something, like an ajax call to server
  // evt.target references the list item
});
```

#### jQuery or Zepto

```javascript
$("#list li").on("delete", function(evt) {
  // ...
});
```

## Install

SwipeOut requires [Hammer.js](http://eightmedia.github.com/hammer.js/).  Include the following two files on your website:

[Hammer.js](https://raw.github.com/EightMedia/hammer.js/master/hammer.js) and [SwipeOut](https://raw.github.com/ankane/swipeout/master/swipeout.js)

Just over **3kb total** when minified and gzipped

```html
<script src="path/to/hammer.js"></script>
<script src="path/to/swipeout.js"></script>
```

## Customize

The delete button is unstyled by default.  Give it a custom style, like an iOS theme:

```css
.swipe-out .delete-btn {
  padding: 6px 8px;
  border-radius: 6px;
  border: solid 1px rgb(96,23,18);
  background-image: linear-gradient(top, rgb(242,153,157), rgb(213,62,41));
  background-image: -webkit-linear-gradient(top, rgb(242,153,157), rgb(213,62,41));
  background-image: -moz-linear-gradient(top, rgb(242,153,157), rgb(213,62,41));
  background-image: -o-linear-gradient(top, rgb(242,153,157), rgb(213,62,41));
  text-shadow: 0em -0.1em rgb(51,51,51);
  color: #fff;
  font: bold 14px/20px "Helvetica Neue", Arial, Helvetica, sans-serif;
}
```

The delete button text can be set with:

```javascript
new SwipeOut(list, {btnText: "Remove"}); // default: "Delete"
```
