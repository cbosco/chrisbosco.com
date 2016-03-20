---
title: Nicole Sullivan Talks OOCSS and Process
template:   post.ejs
Date: 2011-06-25
Slug: Nicole-Sullivan-Talks-OOCSS-and-Process
Tags: CSS
Abstract: Nicole Sullivan (aka @stubbornella) brought Object-oriented CSS (OOCSS) to NYC last Thursday in an updated presentation on how our best practices in CSS are killing us. She was refreshingly candid and it was great to have insight into her work process with big clients. 
---

Nicole Sullivan (aka [@stubbornella](http://twitter.com/stubbornella))
brought Object-oriented CSS (OOCSS) to NYC [last
Thursday](http://www.nywebperformance.org/events/16508168/) in an
updated presentation on how our [best practices in CSS are killing
us](http://www.stubbornella.org/content/2011/04/28/our-best-practices-are-killing-us/).
She was refreshingly candid and it was great to have insight into her
work process with big clients.

## First, some data...

Facebook was kind enough to share some data on its CSS revamp that
Nicole helped with. Some stand-outs of their CSS code debt:

-   100MB of CSS. Have to use grep; can't read it all
-   Blue brand color declared 261 times
-   558 unique hex values
-   6498 total color declarations

Salesforce, another of Nicole's clients, had almost 4000 padding
declarations. This is evidence of a long history of tweaking the page
layout and presentation. Although "ugly," one of Nicole's deliverables
actually included reusable padding classes (more on that later).

## (Some) CSS best practices are myths

**Don't add extra elements**. This is usually based on concern that HTML
size is going to grow and download speeds and SEO may suffer. However,
data show that the size of HTML actually decreases with OOCSS.

Just go ahead and change markup. Think of the markup as LEGO pieces you
can copy paste around the site. That's your unit of re-use.

**Don't add classes (classitis)**. If you don't *just* use classes, you
better prepare to calculate specificity (discussed below) for every
selector you write. If you limit yourself to classes and one class per
selector, you can start to rely on the cascade (order selector appears
in the stylesheet) which is far more intuitive.

**Use descendant selectors**. This has a lot of bad side effects in your
stylesheet(s)

1.  Duplicate elements in selectors
2.  Can lead to duplicate key:value pairs when design changes
3.  Specificity grows fast and gets complicated to override

Instead, think "add a class to the thing you want to change." This could
be a module (container), in which case it is OK to use descendant
selectors, but don't use them as the differentiator (e.g. `h3` vs.
`#sidebar h3`)

## Specificity points of a CSS selector

Easiest way to show this is an example:

	:::css
    #sidebar section h2.eyebrow:hover {
        color: red;
    } 
          
<style type="text/css">
#specificity-oocss tbody td {
	border: 1px solid #aaa;
	text-align: center;
	width: 4em;
}
</style>
<table id="specificity-oocss">
	<thead>
		<tr>
			<th>
				Inline
			</th>
			<th>
				IDs
			</th>
			<th>
				Classes
			</th>
			<th>
				Elements
			</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>&nbsp;</td>
			<td>1</td>
			<td>2</td>
			<td>2</td>
		</tr>
	</tbody>
</table> 


Concat the numbers from left to right to make the point value. In this
case, **122**. Each category is an order of magnitude more important. If
a selector has only elements, it's going to take more than 10 (!) to
override a simple class selector.

Note that pseudoclasses (e.g. `:hover`) count as a class for specificity
points. Also, another odd one, the universal selector(`*`) has a value
of zero.

You should never get to the thousands because inline styles are an
antipattern. Speaking of antipatterns, how does `!important` work? It
will shift this by 4 decimal places:

	:::css
    h3 { 
        color: blue !important;
    }

The color style would have a specificity of 10,000. Not quite "wins over
everything else." Specificity still has room to grow!

Obviously this quickly gets complicated and is what leads to OOCSS
practices like simple one-class only selectors that can be combined in
HTML LEGO pieces.

OOCSS, of which a short definition always escapes me, was succintly
described: OOCSS focuses on selectors as your CSS architecture, instead
of what happens "between the braces." (old hotness = cross browser
hacking)

## CSSLint

[CSSLint](http://csslint.net/) (which will also [hurt your
feelings](http://www.jslint.com/)) was demoed. It's a node.js app and
open-sourced on [github](https://github.com/stubbornella/csslint).
Nicole built the alrgorithm from reverse-engineering her own CSS and
looking for machine-testable bad practice

## And finally, some miscellaneous bits from Q&A

Attribute selectors are slow, especially the regex ones. nth-child and
first-child are practical though

Nicole built "spacing classes" for clients to do their own HTML tweaking
like "m-n-l" (margin north large) as well as dividers (as HTML elements
rather than just classes)

When building a style guide for a client, each unit documented should be
really simple. Simple pieces, complex combinations. LEGO LEGO LEGO :)

Admittedly, OOCSS requires up-front analysis of visual design to come up
with the repeatable units. This isn't always a good fit with an agile
project.
