---
title: Sorting jQuery DOM Elements
template:   post.ejs
Date: 2010-03-28
Slug: Sorting-jQuery-DOM-Elements
Tags: JavaScript, jQuery
Abstract: While updating the jQuery version referenced by a website I was working on, I found an interesting trick you can do with collections of DOM elements as of jQuery 1.3.2 (February 2009). Prior to this release, selecting a collection of DOM elements would return a plain old JavaScript object. Now, you get an array.
---


While updating the jQuery version referenced by a website I was working
on, I found an interesting trick you can do with collections of DOM
elements as of [jQuery
1.3.2](http://blog.jquery.com/2009/02/20/jquery-132-released/) (February
2009). Prior to this release, selecting a collection of DOM elements
would return a plain old JavaScript object. Now, you get an array.

This may not jump out at you as exciting in and of itself, but for me
the ability to use array methods on these collections was really
helpful. By writing a simple array sort method, I was able to grab one
giant alphabetically ordered list of items from any number of smaller,
categorized lists on my page, and then display that list in different
ways on the fly. Here is a simple example of how to set this up.

Markup:

	:::html
    <ul id="ArraySource">
        <li>
            <h4>Category 1</h4>
            <ul>
                <li rel="Category_1" name="Item_1">
                    Item 1
                </li>
                <li rel="Category_1" name="Item_2">
                    Item 2
                </li>
                ...
            </ul>
        </li>
        <li>
            <h4>Category 2</h4>
            <ul>...</ul>
        </li>
        ...
    </ul>

JavaScript:

	:::javascript
	/*    ArrayTest.list will be an alpha-sorted DOM collection    */
	var ArrayTest = {
		setup: function(source) {
			this.list = $(source);
			try { this.list.sort(this.alphaSort); } catch(e) { /*legacy javascript; sort unsupported*/ }
		},
		alphaSort: function(a,b) {
			var A = a.getAttribute('name').toUpperCase();	// Make comparison case insensitive
			var B = b.getAttribute('name').toUpperCase();
			if (A < B) { return -1; }
			else if (A > B) { return 1; }
			else { return 0; }
		}
	};
	$(document).ready(function(){
		ArrayTest.setup('#ArraySource ul li');
		// ...Do something with ArrayTest.list ...
	});

This way, you can present the items categorized in a default, accessible
way in the markup, and then with a few lines of JavaScript and jQuery,
you've got the complete list at your disposal, sorted alphabetically,
and ready to be re-categorized or filtered along any dimension desired,
through whatever UI widget/pattern is preferred. This can be
particularly useful when you want the page to contain a lot of
information at the onset for SEO concerns, but prefer a more dynamic
experience for users.
