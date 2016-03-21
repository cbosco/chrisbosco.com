---
title: PPK in the BK on Mobile JavaScript
template:   post.ejs
Date: 2011-04-16	
filename: PPK-in-the-BK-on-Mobile-JavaScript.html
Tags: Mobile Web, JavaScript, UI Patterns
Abstract: I recently had the pleasure of seeing a true Web pioneer give a talk on mobile JavaScript. A Touching Look Into The Future Known As Today brings Peter-Paul Koch (@ppk, creator of quirksmode.org) to Brooklyn to give an updated talk about his experience in the trenches testing JavaScript touch event support on various mobile devices. I'll attempt to distill it down to some key points.
---

I recently had the pleasure of seeing a true Web pioneer give a talk on
mobile JavaScript. [A Touching Look Into The Future Known As
Today](http://www.meetup.com/doctype-html/events/17057021/) brings
Peter-Paul Koch ([@ppk](http://twitter.com/PPK), creator of
[quirksmode.org](http://www.quirksmode.org/)) to Brooklyn to give an
updated talk about his experience in the trenches testing JavaScript
touch event support on various mobile devices. I'll attempt to distill
it down to some key points.

## Mouse events and touch events are blended on mobile

The three interaction modes, in the order of the most to least we know
about them:

1.  Mouse
2.  Keyboard
3.  Touch

Event handling on the desktop is easy because the mouse and keyboard
events rarely fire simultaneously. But with the advent of touch-screen
devices, both touch and mouse events fire, a conscious decision to allow
mobile users to browse the countless existing sites relying on mouse
events for interaction.

If you want to make a distinction:

```javascript
// desktop
element.onmousedown = dostuff;

// touch
element.ontouchstart = function() {
  dostuff();
  element.onmousedown = null;
};
```

## Half-a-second delay on click

Conventional web design tells us the click event is slow because it
doesn't fire until after a mousedown followed by mouseup. Some web
experiences optimize for this by using mousedown. In mobile, it's even
more noticeable (delay approaches 500ms). There are many possibilities
once a touch starts (drag, swipe, pinch, long-press) and a delay is the
only resort the OS has to determine when a click (simple one-finger
touch) has happened.

Touchstart is the touch equivalent of mousedown, but bind to it at your
own risk (do you know how to fine-tune interaction better than Apple?)

In short, no matter how many cores in your high-end tablet processor,
you're still going to experience a noticeable delay when clicking on
links (or anything livened on click) in a web experience on your device.

## Use onclick to catch the long tail of mobile devices out there

If your concern is a large breadth of device support in your JavaScript,
rely on the click event. Recall that this was ambiguous in the desktop
world (fired by enter key and all mouse buttons) so it covered multiple
cases there, too.

But also consider that touch really isn't click. There is much more
information in a touch such as concurrent touches and touch area that
simply vanishes when translated to a click.

## What you can't (yet) do…

A lot of time was spent on the point that hover is unsupported on
mobile, at least not in the way it is intended. This segues into
[LukeW's mobile first approach](http://www.lukew.com/ff/entry.asp?933),
and how this kind of thinking forces you to focus on the most important
content. Maybe what's in that hover tooltip really isn't critical after
all...

There is no wide support for the zoom event but it would be an
interesting way to measure how readable and navigable your website is
through analytics. Do users often have to zoom in on your forms or text
content?

## The spec (and its quirks)

Apple's guidelines for the blend of events that fire on a touch quickly
became a standard adopted by all other multitouch devices:

1.  Touchstart
2.  Mouseover
3.  Mousemove (only one)
4.  Mousedown
5.  Click
6.  (Apply any hover styles)

On iOS and Symbian, if the DOM changes on mouseover to include style
changes, all further events are cancelled. An example of why this is
desirable is a traditional dropdown menu, as it gives you an elegant way
to open the menu without risking following a top-level link.

If you touch a new element on a page, mouseout fires on the original
element.

The touchmove event continues to fire after finger leaves the element
firing the event.

Event delegation on iOS stops at the body element and does not reach the
document element. An ugly workaround is to add an anonymous empty
function to the element you want to delegate to on the appropriate
event. An even weirder workaround: cursor: pointer in CSS.

## Converting common patterns to mobile - drag, drop and carousel

Bind mousemove to the document to account for erratic movement (this is
good practice on the desktop too). Contrast this with touchmove which
continues to fire as you leave the element, so there's no need to listen
at a higher level.

For keyboard control on drag and drop, use keydown on arrow keys

A nifty implementation of carousel in mobile:
[http://quirksmode.org/m/tests/scrollayer.html](http://quirksmode.org/m/tests/scrollayer.html)

## Q&A

Q&A focused on current trends.

Multitouch trackpads? What we know today is a 2-finger scroll fires
mousewheel event. That might be the extent of touch recognition in
JavaScript, because the interaction is not as direct with a trackpad.

Progressive enhancement will become mandatory. Pixel perfect styling
will be prohibitive in time and cost.

Do we foresee any new touch events? Maybe a few but the current spec
lets us combine touch information to describe almost any gesture. What
may grow is support for the accelerometer and other sensors available on
different devices.

Thanks for coming to New York, [PPK](http://twitter.com/ppk)! (And
thanks [HUGE](http://www.twitter.com/hugeinc) for hosting - you might
have the sweetest office space in the world).
