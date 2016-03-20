---
title: Enhancing Your UI Before Page Load
template:   post.ejs
Date: 2009-10-13
Slug: Enhancing-Your-UI-Before-Page-Load
Tags: Accessibility, JavaScript
Abstract: A common drawback of progressive enhancement is that the UI will often "flash" or "flicker" when first loading. This is because conventional wisdom of separation of concerns calls for waiting until the DOM is ready to set up the UI for a richer interaction (tabs, accordion, drilldown, the list goes on). While this makes sense academically, we're not always putting the user experience first.
---


A common drawback of [progressive
enhancement](http://www.alistapart.com/articles/understandingprogressiveenhancement/)
is that the UI will often "flash" or "flicker" when first loading. This
is because conventional wisdom of [separation of
concerns](http://peter.michaux.ca/articles/the-window-onload-problem-still)
calls for waiting until the DOM is ready to set up the UI for a richer
interaction (tabs, accordion, drilldown, the list goes on). While this
makes sense academically, we're not always putting the user experience
first. Trust me, users *do* notice these things, even when they occur in
[under a second](http://www.useit.com/papers/responsetime.html).

Personally, the majority of what I do to prepare for an enhanced
interaction is to hide and show elements and apply some styles. So, why
wait for anything to load? What I really need is to simply check for
JavaScript support; an aspect of the browser, not the content being
loaded.

Assuming a general case where all that is needed is to A) know that
JavaScript is supported and B) apply some enhanced CSS styles when A is
true, we can do this as early as the `<head />` portion of the page, and
incur no flicker penalty.

A simple, if inelegant solution, is to `document.write()` a CSS file
full of "enhanced" styles into the `<head />` area of the page,
typically right after all of your basic CSS.

	:::html
    <link type="text/css" href="base.css" rel="stylesheet" />
    <script type="text/javascript">
        document.write('<link type="text/css" href="enhanced.css" rel="stylesheet" />');
    </script>

With this, we trade some code maintainability for a potentially drastic
improvement in performance and seamlessness (disclaimer: may not be a
word). Waiting for content to load to set up a JavaScript-enhanced UI is
a twofold problem: for one, there is the obvious added wait time and
aforementioned flicker you'll likely see, but there is also
[reflow](http://www.mozilla.org/newlayout/doc/reflow.html) introduced.
In short, the affected area of the page has to be rendered twice which
takes even *more* time.

I've created a little [demo](http://projects.cbsides.com/blog/demo/enhancedcss/) of
this to illustrate the technique. I don't have any quantitative
performance comparisons as there is a near-infinite number of
combinations of browser and implementation, but I've found the technique
to be quite helpful, at least anecdotally. If you're like me and need to
wait for external content such as web analytics images or 3rd party ads
to load, you could see an improvement measured in seconds depending on
your browser (looking in your direction, IE6/7)

I should mention this is a very simple, maybe even commonly used
technique for many developers, but I haven't seen it widely endorsed
(probably because it's not very elegant) and I felt it was worth
promoting this underrated (in my opinion) solution to a common problem
with an otherwise great approach to building accessible web content.
