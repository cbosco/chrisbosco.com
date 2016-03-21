---
title: Spellcheck Rich Text with GoogieSpell
template:   post.ejs
Date: 2010-08-29
Slug: Spellcheck-Rich-Text-with-GoogieSpell
Tags: JavaScript, Widgets
Abstract: In an earlier post, I explained how to modify the GoogieSpell JavaScript spellchecker to work with text in HTML tags. For an introduction to Orangoo Labs' GoogieSpell, refer to that post. Based on feedback I received, it appeared worthwhile to show how to spellcheck rich text on demand. I'll explain how that's done with a popular editor, FCKEditor.
---

In an earlier post, I explained how to modify the GoogieSpell JavaScript
spellchecker to [work with text in HTML
tags](../Spellcheck-HTML-Inline-with-GoogieSpell.html). For an
introduction to Orangoo Labs'
[GoogieSpell](http://orangoo.com/labs/GoogieSpell/), refer to that post.
Based on feedback I received, it appeared worthwhile to show how to
spellcheck rich text on demand. I'll explain how that's done with a
popular editor, [FCKEditor](http://sourceforge.net/projects/fckeditor/).

In retrospect, I shouldn't be surprised as this is a much more useful
application of GoogieSpell. In fact,
[SCAYT](http://www.spellchecker.net/v3/products/scayt.html), a similar
tool to GoogieSpell (but requiring a license), has found its way into
[CKEditor](http://ckeditor.com/), the successor to FCKEditor. As a
bonus, I've included JavaScript that will integrate GoogieSpell with
CKEditor, but I'll limit the detail here to the FCKEditor
implementation.

Before we dive in, let's see this in action:

<span id="spell_container"></span>
<textarea id="FCKeditor1" name="FCKeditor1" cols="40" rows="6">This is <b>the</b> initial value.  And a typpo.</textarea>

[Download files](#Download)

The simplest way to describe how this works is that there are event
listeners on both objects with references to both GoogieSpell and
FCKEditor on every function call. This way, when something happens to
GoogieSpell you can make changes to the editor, and vice versa.

## FCKEditor First, GoogieSpell Second

First, we build FCKEditor around a textarea for proper progressive
enhancement (although you can instantiate the editor any way you wish).

```javascript
window.onload = function() {
  var oFCKeditor = new FCKeditor('FCKeditor1');
  oFCKeditor.ReplaceTextarea();
};
```

FCKEditor calls the `FCKeditor_OnComplete` function once it's done its
thing, and it's at this point we intercept, and instantiate GoogieSpell.
The "textarea" we decorate with GoogieSpell is FCKEditor's editor
document, which happens to be nested within an iframe element (the
source of much fun later).

```javascript
function FCKeditor_OnComplete(editorObj)
{
  var editorDocument = editorObj.EditingArea.Document,
      googie = new GoogieSpell('/demo/googiespell/', '/demo/googiespell/sendReq.php?lang=');
  googie.setSpellContainer('spell_container');
  googie.decorateTextarea(editorDocument.body);
}
```

## I'm Spellchecking!

GoogieSpell fires a state change event when you check spelling. If we
pass a reference to the FCKEditor, we can alter it when we perform a
spellcheck.

```javascript	
googie.spelling_state_observer = function(state, googie) {
  onGoogieStateChange(state, googie, editorObj);
};
```

Feel free to act on the editor in other ways here. I like to disable the
editor's buttons to reinforce that this isn't a fully editable state
while spellchecking.

```javascript
function onGoogieStateChange(state, googie, editorObj) {
  if (state === "checking_spell") {
    editorObj.ToolbarSet.Disable();
  }
  else if (state === "spell_check"){  //inactive
    editorObj.ToolbarSet.Enable();
  }
}
```

## Build It Where You Use It

A small, yet important detail is that GoogieSpell expects to be creating
its components and adding them in the same document, but now we need to
account for elements inside and outside of an iframe. Some browsers (by
Microsoft) won't allow you to create an element and then append it to a
nested document within an iframe on your page, even if they're both of
the same domain/origin.

Unfortunately, this means we need to modify GoogieSpell's script
directly. By default GoogieSpell uses the `AJS.DIV` and `AJS.SPAN` to
create its elements. These functions shortcut eventually to
`document.createElement` which refers to the parent document
(`window.top.document`). Instead, we can call a new function,
`createInFrame`, that uses the iframe's own document to do the element
building.

```javascript
googie.createInFrame = function(tag, className) {
  var o = editorDocument.createElement(tag);
  if (className)
    o.className = className;
  return o;
};
```

## Look & Feel

Now we should actually be able to spellcheck without any errors. But
things are still pretty clunky. For one, GoogieSpell's CSS isn't going
to cascade into your editor's iframe document. The cleanest way to fix
this would be to use an `@import` statement in FCKEditor's
editor\_area.css file. However, I have a quick and dirty approach that
you can use when instantiating GoogieSpell.

```javascript
var googieCSS = editorDocument.createElement('link');
googieCSS.setAttribute('rel', 'stylesheet');
googieCSS.setAttribute('type', 'text/css');
googieCSS.setAttribute('href', '/demo/googiespell/googiespell.css');
editorDocument.getElementsByTagName('head')[0].appendChild(googieCSS);
```

GoogieSpell's edit layer also has some hard-coded inline styles and
dimensions that aren't going to look quite right. These should probably
be in GoogieSpell's CSS file anyway, but let's account for them by
creating an opportunity to override them. Again we resort to editing
GoogieSpell's script, this time adding a new listener:
`edit_layer_ready_observer`. Follow the pattern of the state change
observer and add a reference to both GoogieSpell and your FCKEditor.

```javascript
googie.edit_layer_ready_observer = function(googie) {
  onGoogieLayerReady(googie, editorObj);
};
```

This callback function simply adds appropriate styles to GoogieSpell's
edit layer so that it fills the FCKEditor and matches visually. It's
also a jumping off point for further customization.

```javascript
function onGoogieLayerReady(googie, editorObj) {
  var layerStyle = googie.edit_layer.style;
  layerStyle.padding = "5px"; // match FCKeditor padding
  layerStyle.border = 'none';
  layerStyle.fontFamily = "Arial,Verdana,sans-serif";
  layerStyle.fontSize = "12px";

  if (AJS.isIe()) {
    AJS.setHeight(googie.edit_layer, editorObj.EditingArea.IFrame.offsetHeight);
  } else {
    AJS.setHeight(googie.edit_layer, 'auto');  
  }
  AJS.setWidth(googie.edit_layer, 'auto');
}
```

The final change comes when we click a mis-spelled word and bring up
GoogieSpell's suggestions. The window needs to be offset based on the
position of the FCKEditor's iframe. Following the previous change, we
add yet another listener, `editor_window_ready_observer`, along with a
new callback function.

```javascript
function onGoogieSuggestionsReady(googie, editorObj) {
  var w = googie.error_window,
      w_pos = AJS.absolutePosition(w),
      editorFrame = editorObj.LinkedField.previousSibling;
  
  if (editorFrame) {
    var e_pos = AJS.absolutePosition(editorFrame),
        toolBarHeight = editorObj.ToolbarSet._TargetElement.offsetHeight;
    w_pos.y += (e_pos.y + toolBarHeight);
    w_pos.x += e_pos.x;
  }  
  
  AJS.setTop(w, w_pos.y);
  AJS.setLeft(w, w_pos.x);
  
  //  Adjust IE's iframe shim to match, if present
  if (googie.error_window_iframe) {
    AJS.setTop(googie.error_window_iframe, w_pos.y);
    AJS.setLeft(googie.error_window_iframe, w_pos.x);
  }
}
```

## CKEditor

And that pretty much wraps things up. Although FCKEditor is still
popular, it was succeeded by CKEditor, a completely rewritten rich text
editor. A similar approach can be followed (if you really want to — it
comes with SCAYT). I've included a template for CKEditor as well. It's a
little rough around the edges and not working in IE6 or 7 but it calls
the appropriate editor API functions where applicable. Of note is the
fact that CKEditor actually comes packed with
[Dojo](http://www.dojotoolkit.org/), for better or worse, so you have a
lot at your disposal if you're familiar with the library.


<a name="Download"></a>
## Download

-   GoogieSpell rich text editor JavaScript: [googiespell\_editor.js](http://github.com/cbosco/googiespell/blob/master/googiespell_editor.js)
-   FCKEditor template:
    [fckeditor\_template.js](http://github.com/cbosco/googiespell/blob/master/fckeditor_template.js)
-   CKEditor template:
    [ckeditor\_template.js](http://github.com/cbosco/googiespell/blob/master/ckeditor_template.js)
-   Or, get all GoogieSpell files: [googiespell repo at
    github](http://github.com/cbosco/googiespell/tree/master)



<link href="http://projects.cbsides.com/blog/demo/googiespell/googiespell.css" rel="stylesheet" type="text/css" media="all" />

<script type="text/javascript" src="http://projects.cbsides.com/blog/demo/googiespell/AJS.js"></script>
<script type="text/javascript" src="http://projects.cbsides.com/blog/demo/googiespell/cookiesupport.js"></script>

<script type="text/javascript" src="http://projects.cbsides.com/blog/demo/googiespell/googiespell_editor.js"></script>
<script type="text/javascript" src="http://projects.cbsides.com/blog/demo/fckeditor/fckeditor.js"></script>
<script type="text/javascript" src="http://projects.cbsides.com/blog/demo/googiespell/fckeditor_template.js"></script>
<script>
document.domain = "cbsides.com";
</script>
