---
title: "RequireJS: What Not To Do"
template:   post.ejs
Date: 2011-03-26	
Slug: RequireJS-What-Not-To-Do
Tags: JavaScript
Abstract: As with most things, using RequireJS wrong can be worse than not using it at all.
---

As with most things, using RequireJS wrong can be worse than not using
it at all.

[RequireJS](http://requirejs.org/) is a modular script loader that lets
you pull in multiple JavaScript files in an optimized way that cheats a
few rules we've been used to when downloading resources in the
traditional way on the Web. Not only does RequireJS have great API
documentation, its [Why](http://requirejs.org/docs/why.html) page is a
great read, and explains how they've arrived at their approach of using
`head.appendChild(script)` to load JavaScript asynchronously.

After building [The Shoshin
Project](http://chrisbosco.com/work/#/explore/the-shoshin-project) (a
simple single-page web app) which used [Google
Closure](http://code.google.com/closure/) to bundle multiple JavaScript
files/modules into a single request, the concept evolved into a more
interactive, multiple-page site. As a team we decided to try out
RequireJS on the new site, hoping to carry on the modular approach used
in the original site without being forced to include all possible
combinations of JavaScript modules on every page load.

In our first dive into things, we put our page enhancements like
overlays, autocomplete, and so on into the RequireJS modular system.
Shortly into it we noticed some strange behavior where it looked like
some of our slower external scripts were blocking even the most simple
page interactions from livening up.

The (obvious in hindsight) breakthrough for me came in the realization
that externally hosted, third-party scripts can (and should) be loaded
using RequireJS. Traditionally, we did the most basic optimization of
putting our `script` tags near the end of the `body` tag so they don't
block page render, and then went the added step of putting any analytics
and/or externally hosted scripts below the application scripts so they
get parsed last and don't block page functionality.

What seems to have happened is RequireJS can't actually start executing
scripts until all synchronous script calls are done, as there could be
additional definitions it has yet to parse. So while we thought saving
our third party scripts for the end of the document was a good idea,
they were actually executing first, completely throwing a wrench into
things. Once it was clear that they can be easily incorporated into the
RequireJS dependency model, it was easy enough to create one-line
definitions for them and throw those at the end of our global RequireJS
definitions. No more blocking!

For example:

	:::javascript
    define('facebook', ['http://connect.facebook.net/en_US/all.js']);

The final solution, in terms of explicit script tags:

1.  [Modernizr](http://www.modernizr.com/) (in `head`)
2.  [jQuery](http://jquery.com/) (via [Google
    CDN](http://code.google.com/apis/libraries/devguide.html#jquery)
    with a `document.write()` [fallback to
    local](http://html5boilerplate.com/))
3.  [RequireJS](http://requirejs.org/)
4.  Global require definitions (via RequireJS)
5.  Page specific require calls (via RequireJS)

