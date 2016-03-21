---
title: Scrolling In-Page Links with jQuery
template:   post.ejs
Date: 2009-07-06
Slug: Scrolling-In-Page-Links-with-jQuery
Tags: JavaScript, jQuery, UI Patterns
Abstract: In-page links (or, links that jump to specific areas of the current page) are definitely useful for lengthy or text-heavy sites, and often essential when these pages are consumed by screenreaders or "legacy" mobile devices. But they can also be disorienting for many reasons — did I just move up the page? Down it? With the instantaneous transition the browser provides by default, a user is left to guess.
---


In-page links (or, links that jump to specific areas of the current
page) are definitely useful for lengthy or text-heavy sites, and often
essential when these pages are consumed by screenreaders or "legacy"
mobile devices. But they can also be disorienting for [many
reasons](http://www.useit.com/alertbox/within_page_links.html) — did I
just move up the page? Down it? With the instantaneous transition the
browser provides by default, a user is left to guess.

I wouldn't be the first to suggest overriding this behavior with a
scrolling effect that illuminates which direction you've traveled, and
also how far. A global, automatic solution would be ideal. For animated
effects, a robust JavaScript library can save a lot of time, and I'll
use the popular [jQuery](http://jquery.com) library for this example.
Out of the box, jQuery does not have this functionality, and although
there is an [appropriate
plugin](http://plugins.jquery.com/project/ScrollTo), I was determined to
cobble together my own solution so as to avoid loading an additional
plugin only to use it in this one instance.

A quick seach brought me to [Learning
jQuery](http://www.learningjquery.com/2007/09/animated-scrolling-with-jquery-12),
where there is a great solution I've shamelessly copied (with very minor
modification). I will walk through this solution below, although I
recommend reading the original breakdown at Learning jQuery.

```javascript
$(document).ready(function() {
    $('a[href*=#]').click(function() {
        var target = $('a[name=' + this.hash.split('#')[1] + ']');
        if (target.length) {
            var targetOffset = target.offset().top - 2;
            $('html,body').animate({scrollTop: targetOffset}, 'fast');
            return false;
        }
    });
});
```

1. Attach a click event to every anchor element with an `href`
attribute beginning with a '\#' (e.g. any in-page link).

    ```javascript
    $('a[href*=#]').click(function() { ... });
    ```

2. Get the link's destination on the page using its `hash` property.
`hash` refers to the portion of any URL that begins with '\#'. Use this
in another selector to get the anchor element on this page with the
corresponding `name` attribute. Save this as the `target` variable.

    ```javascript
    var target = $('a[name=' + this.hash.split('#')[1] + ']');
    ```

3. If this element exists on the page (`target` collection length
greater than zero), get the distance from the top of the page to this
element and save it as `targetOffset` (note that I subtract 2 to give a
little bit of breathing room visually; this way the element doesn't
touch the top of the browser frame).

    ```javascript
    if (target.length) {
        var targetOffset = target.offset().top - 2;
        //...
    }
    ```

4. Now use jQuery's built-in
[`animate()`](http://docs.jquery.com/Effects/animate) method to scroll
the page itself (grabbing the `html` or `body` element in case the
browser is in
[quirksmode](http://www.quirksmode.org/css/quirksmode.html)).

    ```javascript
    $('html,body').animate({scrollTop: targetOffset}, 'fast');
    ```

5. Return `false` because now you don't actually follow this link.

    ```javascript
    return false;
    ```

You can see this in action in many areas of this site as long as you
have javascript enabled. For example, try clicking the "top ↑" link in
the right-hand column.

It's of note that the
[`animate()`](http://docs.jquery.com/Effects/animate) method takes a
variety of arguments. I've only supplied the target for `scrollTop` and
the speed ("fast"), but it's a very powerful function. A third argument,
`easing`, is available via a plugin, and can make the animation look
much more natural. In my case, however, I opted for less code overhead
and omitted this. The final argument, `callback`, provides for some
interesting possibilities, but I also found it to be unnecessary for
this case.
