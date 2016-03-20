---
title: "Drop-Down Menus: Don't Neglect Timing"
template:   post.ejs
Date: 2010-03-29
Slug: "Drop-Down-Menus-Dont-Neglect-Timing"
Tags: Accessibility, UI Patterns
Abstract: I was recently building a "mega menu" (a really big drop-down menu panel) for primary navigation, so I decided to re-read the Jakob Nielsen Alertbox regarding them.  Apparently the mega menu is the only form of drop-down menu to perform well under user testing.
---

I was recently building a "mega menu" (a really big drop-down menu
panel) for primary navigation, so I decided to re-read the [Jakob
Nielsen
Alertbox](http://www.useit.com/alertbox/mega-dropdown-menus.html)
regarding them. Apparently the mega menu is the only form of drop-down
menu to perform well under user testing.

In the discussion of timing for the interaction, I was reminded of how
only a few years ago it seemed that [creating drop-down menus using only
the CSS :hover
pseudoclass](http://www.alistapart.com/articles/dropdowns/ "CSS drop-downs: Great for their time!")
was the trend, and how that pretty much violates all of the
recommendations:

1.  Wait 0.5 seconds.
2.  If the pointer is still hovering over a navbar item, display its
    mega drop-down within 0.1 seconds.
3.  Keep showing it until the pointer has been outside both the navbar
    item and the drop-down for 0.5 seconds. Then, remove it in less
    than 0.1 seconds.

Nielsen goes on to say, regarding mouseover:

> [T]he mouse should remain stationary for 0.5 seconds before you
> display anything that's hover-dependent, such as a mega drop-down or a
> tooltip. Violating this guideline will make the screen flicker
> insufferably when users move the mouse.

I've suffered through my share of instantly dropping menus on websites
(usually coupled with an all-too-complicated navigation structure), and
it didn't occur to me what a dramatic effect that half-second pause
really has. So, with this in mind, how about using the CSS version as a
base for enhancement, so users without JavaScript can still get a
version of this effect? It seems research reveals that even in that
case, a CSS drop-down menu should be avoided:

> Don't bother making the drop-down itself accessible. Instead, make
> each top-level menu choice clickable, leading to a regular Web page
> where you present all drop-down options in plain, fully accessible
> HTML.

It's almost too obvious. CSS drop-downs, you sure were a fun technical
exercise, but I'm happy to bid you farewell in favor of a better
experience for users (not to mention less cross-browser-induced head
trauma!).
