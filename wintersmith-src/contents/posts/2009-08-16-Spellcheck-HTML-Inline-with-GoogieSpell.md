---
title: Spellcheck HTML Inline with GoogieSpell
template:   post.ejs
Date: 2009-08-16
filename: Spellcheck-HTML-Inline-with-GoogieSpell.html
Tags: JavaScript, Widgets
Abstract: Orangoo Labs' GoogieSpell widget is a really clever way of spellchecking input fields or textareas on a Web form, completely inline (think Microsoft Word) and without that nasty popup window you usually see that loops through all of your typos serially. As a bonus, by default it makes a call to Google's spellchecking web service so you don't have to install or maintain your own dictionary (although you can easily extend it to do so). Also, did I mention it's FREE?
---

![GoogieSpell screenshot](http://projects.chrisbosco.com/blog/demo/googiespell/googie_example.png)

Orangoo
Labs' [GoogieSpell](http://orangoo.com/labs/GoogieSpell/) widget is a
really clever way of spellchecking input fields or textareas on a Web
form, completely inline (think Microsoft Word) and without that nasty
popup window you usually see that loops through all of your typos
serially. As a bonus, by default it makes a call to Google's
spellchecking web service so you don't have to install or maintain your
own dictionary (although you can easily extend it to do so). Also, did I
mention it's FREE?

I recently worked on an online workflow for writing, and one of our
primary goals was to curb the amount of spelling mistakes we were seeing
from the authors. Our solution was to spellcheck their content in an
elegant but mandatory way. Enter GoogieSpell.

But, nobody is satisfied with just *plain text* anymore, right? Much of
this content happens to be HTML from [a popular 3rd party rich text
editor](http://www.fckeditor.net/). This presented a more complicated
problem than it sounds (or maybe it sounds just about as complicated as
it is?) and I'm going to walk through my solution: making GoogieSpell
play nicely with both HTML and plain text.

You can [download](#download) my modified version of GoogieSpell below; I've modified
both the original GoogieSpell JavaScript (which instantiates one
spellchecker per DOM element) as well as GoogieSpell's later-released
"Multiple" version, which can check multiple elements through one
spellchecker instance. I have also modified the original demo page to
include an HTML spellchecking example.

[Download files](#Download)

First, we add a new GoogieSpell property, `GoogieSpell.isHTML`, along
with getter/setter methods. This acts as a flag for whether you need to
spellcheck plain text (`input` or `textarea` tags) or HTML (anything
else).

```javascript
/*
    GoogieSpell HTML support / switch between modes
*/
GoogieSpell.isHTML = false;
GoogieSpell.prototype.setIsHTML = function(el) {
    var origSupport = new RegExp('input|textarea', 'i');
    this.isHTML = origSupport.test(el.nodeName) ? false : true;
}
GoogieSpell.prototype.getIsHTML = function() {
    return this.isHTML;
}
```

Second, we need to wire this new property into GoogieSpell's `getValue`
and `setValue` methods, and tell it to use either the `innerHTML` or
`value` attribute.

`getValue`:

```javascript
return (this.getIsHTML()) ? ta.innerHTML : ta.value;
```

`setValue`:

```javascript
if (this.getIsHTML()) {
    ta.innerHTML = value;
} else {
    ta.value = value;
}
```

Up to now, this has all been pretty straightforward, but once we get to
GoogieSpell's `showErrorsInIframe` method, we start to do some
'hacking'. For anyone who has already attempted using GoogieSpell on
HTML, you know the challenge is in GoogieSpell's custom error
object/elements that have many custom properties important to
GoogieSpell's proper functioning, and cannot simply be appended via
`innerHTML`; they will lose all of this custom information in the
process. So in order to retain this information, we add a step before
placing the error objects where error object placeholders are appended
using string manipulation (fully compatible with `innerHTML`) and follow
that by placing the real error objects using DOM manipulation. Problem
solved!

Phase 1: String manipulation. A string representation of the output
called `outputBuffer` is appended with placeholders for the real
GoogieSpell error objects:

```javascript
outputBuffer += '<var class="err_hook">&nbsp;</var>';
```

Phase 2: DOM manipulation. A new function, `insertErrLinks`, is created
that will read through `outputBuffer` and place GoogieSpell's custom
`err_link` objects in their correct spots, using the DOM method
`replaceChild`, preserving all error object information:

```javascript
GoogieSpell.prototype.insertErrLinks = function(output, err_links) {
    var all_vars = output.getElementsByTagName('var');
    var all_vars_len = all_vars.length;
    var err_count = 0;
    var err_len = err_links.length;
    for (var i = 0; i < all_vars_len; i++) {
        if (all_vars[i].className == 'err_hook') {
            //  Replace &nbsp; with span.    is needed for IE implementation of innerHTML
            all_vars[i].replaceChild(err_links[err_count], all_vars[i].firstChild);
            err_count++;
            if (err_count == err_len) break;
        }
    }
}
```

Minor note: I insert the `var` tag now, which some browsers give a
default styling too. I reset this styling in googiespell.css. If you
think that's crazy then by all means modify the script to suit whatever
tag you'd prefer to use! I like `var` becaues it's likely nobody is
using it in the HTML you're checking, so it makes the DOM manipulation
slightly more efficient.

Try it yourself in the paragraph below. Note that you can correct the
spelling but I'm not saving it in any way so it will reappear when this
page is reloaded.

***

<span id="spell_container"></span>

<div id="testHTML">
	<p>
		Heere is a parargaph with <b>bould</b> and <u>underlined</u> text that has some mistaykes
	</p>
	<ol class="fList">
		<li>And here is an orderred list</li>
		<li>With evne more typpos and misspellings!</li>
	</ol>
</div>

***

There is one edge condition with this that I've run across: Google's
dictionary (GoogieSpell's "out of the box" back-end) does not seem to
work perfectly when you feed it HTML. Apparently it will return spelling suggestions that assume some closing tags are part of the words themselves. I've only seen this happen in lists on `li` tags, and only
when the last word is misspelled with no spacing afterwards. We replaced
Google with our own dictionary on the back-end and were able to fully
support HTML afterwards.

So, what next? Well, after getting this far, why not put GoogieSpell
inside the rich text editor itself? I can safely say that after
sufficient banging of head against keyboard, we got this to work too.
Maybe I'll go through that in a future post, but it ended up being a
very specific, customized integration with another 3rd party tool so
I'll leave this discussion as agnostic as possible. The work remaining,
for those interested, involves adding a button to the toolbar of your
editor du jour, and dealing with the never-ending nesting of iframes
these tools typically use.


Happy spellchecking!


**Update:** By popular demand, [Spellcheck Rich Text with GoogieSpell](../Spellcheck-Rich-Text-with-GoogieSpell.html)
explains how to use GoogieSpell with FCKEditor


<a name="Download"></a>

## Download

-   Modified GoogieSpell JavaScript:
    [googiespell.js](http://github.com/cbosco/googiespell/blob/master/googiespell.js)
-   Modified GoogieSpell "Multiple" JavaScript:
    [googiespell\_multiple.js](http://github.com/cbosco/googiespell/blob/master/googiespell_multiple.js)
-   Or, get all modified GoogieSpell files: [googiespell repo at
    github](http://github.com/cbosco/googiespell/tree/master)
    

<script type="text/javascript">
		//document.domain = 'chrisbosco.com';
</script>
<script type="text/javascript" src="http://projects.chrisbosco.com/blog/demo/googiespell/AJS.js"></script>
<script type="text/javascript" src="http://projects.chrisbosco.com/blog/demo/googiespell/googiespell.js"></script>
<script type="text/javascript" src="http://projects.chrisbosco.com/blog/demo/googiespell/cookiesupport.js"></script>
<link href="http://projects.chrisbosco.com/blog/demo/googiespell/googiespell.css" rel="stylesheet" type="text/css" media="all"></link>
<style type="text/css">#testHTML { height: 120px; border: 1px solid #fff; } .post b span { font-weight: bold; }</style>
<script type="text/javascript">
        var googie = new GoogieSpell('http://projects.chrisbosco.com/blog/demo/googiespell/', 'http://projects.chrisbosco.com/blog/demo/googiespell/sendReq.php?lang=');
        googie.setSpellContainer('spell_container');
        googie.decorateTextarea('testHTML');
	
</script>

