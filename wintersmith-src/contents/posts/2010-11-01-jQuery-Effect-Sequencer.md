---
title: jQuery Effect Sequencer
template:   post.ejs
Date: 2010-11-01
Slug: jQuery-Effect-Sequencer
Tags: JavaScript, jQuery
Abstract: I've got the opportunity to build a client-heavy web experience with a big emphasis on transitions and effects. This is probably something that would have been built using Flash just a short time ago, but today we're using everyone's favorite JavaScript library, jQuery.
---

<style type="text/css">
  #list-of-tiles {
    margin: 1em 0;
    padding: 0;
    max-width: 225px;
    min-height: 45px;
    overflow: hidden;
  }
  
  #list-of-tiles li {
    float: left;
    height: 40px;
    width: 40px;
    overflow: hidden;
    margin: 0 5px 5px 0;
    background: #f90;
    color: #fff;
    font: 36px/1 serif;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    display: none;
    list-style: none;
  }
  #list-of-tiles li:nth-child(2n) {
    background: #009;
  }
  #list-of-tiles li:nth-child(3n) {
    background: #3f0;
  }
  #list-of-tiles li:nth-child(4n) {
    background: #c09;
  }
  #list-of-tiles li:nth-child(5n) {
    background: #09f;
  }
  #list-of-tiles li:hover {
    background: gray;
  }
  #list-of-tiles li:active {
    background: #000;
  }
  #tile-count {
    font-family: monospace;
  }
</style>

I've got the opportunity to build a client-heavy web experience with a
big emphasis on transitions and effects. This is probably something that
would have been built using Flash just a short time ago, but today we're
using everyone's favorite JavaScript library, jQuery.

![Sequencer](http://projects.cbsides.com/blog/demo/transitions/sequencer.jpg "CC image courtesy of fonitronik on Flickr")

Just before diving in, I attended [jQuery
Boston](http://events.jquery.org/2010/boston/) and got totally inspired
by a few key talks on JavaScript architecture, mobile web apps, and one
gnome-filled piece from Karl Swedberg titled [jQuery Effects: Beyond the
Basics](http://pres.learningjquery.com/jqcon2010/). This was a really
jam-packed presentation that had something for all levels of jQuery
ninja. My favorite part was a little recursive function called
`sequencer` that calls animations, one after the other, on a collection
of elements. If you try to do something like this directly (without the
sequencer):

	:::javascript
    $('#Gnomes').children().animate({height: '100px'}, 'fast');

jQuery is going to perform the animations simultaneously, which may or
may not be desired. I grabbed the sequencer because I wanted to create a
tiling-in effect for a list of items of a dynamic length. In the
process, I generalized the sequencer a bit, so it works with not only
animate, but the shortcuts we've all come to love such as hide/show,
slideIn/slideOut, and so on, and packaged it as part of a small
transitions framework that's hopefully going to allow me to do some
rapid prototyping on the transitions in my site. Read on for the demo
and github link!

The transition object (feel free to replace `cb` with your own global
namespace) can be extended to add custom transitions and provides the
sequencer for use in them. I also built a demo consumer for the object
that hopefully gives a good sense of how this is used (and how useful it
can be).

The sequencer now also allows for an optional callback function once all
elements have animated, and can traverse the elements backwards or
forwards by changing the direction in your transition. In my example
below, I un-tile the list backward before re-tiling it forward, followed
by a callback that re-enables the "Start" button.

Choose a tile count and click "Start" multiple times to see the effect:


<div>
  <form id="tile-control">
  <select id="tile-count">
    <option selected="selected">Tile count:</option>
    <option value="5">&nbsp;5 tiles</option>
    <option value="10">10 tiles</option>
    <option value="20">20 tiles</option>
    <option value="50">50 tiles</option>
  </select>
  <input id="tile-button" type="submit" value="Start" />    
  </form>

  
  <ul id="list-of-tiles">
    
    
  </ul>
  
</div>

The code, along with the above demo, is available on
[github](http://github.com/cbosco/jquery-transitions).

<a name="Download"></a>
## Download

-   [jquery-transitions on
    GitHub](http://github.com/cbosco/jquery-transitions)

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script src="http://projects.cbsides.com/blog/demo/transitions/cb.transition.js"></script>
<script src="http://projects.cbsides.com/blog/demo/transitions/demo.js"></script>
