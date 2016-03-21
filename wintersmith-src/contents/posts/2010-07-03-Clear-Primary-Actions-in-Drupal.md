---
title: Clear Primary Actions in Drupal
template:   post.ejs
Date: 2010-07-03
Slug: Clear-Primary-Actions-in-Drupal
Tags: Drupal, UI Patterns
Abstract: Clear primary actions can and should be applied across an application anytime there is a choice to be made. Although we can't control our users' actions, we can certainly guide them visually, and as Smashing Magazine points out, "[relieve] the user from having to think about which option to choose in order to complete their task." 
---

Clear primary actions can and should be applied across an application
anytime there is a choice to be made. Although we can't control our
users' actions, we can certainly guide them visually, and as [Smashing
Magazine](http://www.smashingmagazine.com/2009/06/23/10-ui-design-patterns-you-should-be-paying-attention-to/)
points out, "[relieve] the user from having to think about which option
to choose in order to complete their task."

Smashing Magazine does a great job of explaining the pattern:

> What are primary and secondary actions? Primary actions lead to the
> completion of a form; for example, clicking "Save" or "Send."
> Secondary actions usually do not lead to a form's completion; these
> include clicking "Cancel." There are exceptions, though. Which are the
> primary and secondary actions when you see "Save," "Save and continue"
> and "Publish" buttons all in a row? When users have several options,
> highlighting primary actions and de-emphasizing secondary actions are
> good practice.

[Drupal](http://drupal.org)'s administrative interface is completely
lacking this treatment, but after noticing how its buttons are themed
(and applying some CSS3 decoration), it's relatively easy to make
something like this example below:

![Clear primary actions
screenshot](http://projects.cbsides.com/blog/demo/drupal/primary-vs-secondary.png)

This enhancement has 2 components: A Drupal theme change in
`template.php` and the CSS to support it. First, we override the
`button` theme hook in your theme's `template.php` file. We add the
class `primaryAction` to what tends to be a Drupal form's primary submit
action. In all examples I've seen, this element has "edit-submit"
somewhere in its `id` attribute. I made one additional change here to
add the class `button` to every button for simpler CSS styling, since
Drupal's submit buttons are all the ambiguously styled
`<input type="submit"/>` elements.

```php
/*
 *  Primary & Secondary button styling
 */
function phptemplate_button($element) {
  // Make sure not to overwrite classes.
  if (isset($element['#attributes']['class'])) {
    $element['#attributes']['class'] = 'button form-'. $element['#button_type'] .' '. $element['#attributes']['class'];
  }
  else {
    $element['#attributes']['class'] = 'button form-'. $element['#button_type'];
  }
  // Add primaryAction class to all buttons with "edit-submit" pattern in their id
  if (strpos($element['#id'], 'edit-submit') !== FALSE) {
    $element['#attributes']['class'] = 'primaryAction '. $element['#attributes']['class'];    
  }
  return '<input type="submit" '. (empty($element['#name']) ? '' : 
    'name="'. $element['#name'] .'" ') .'id="'. $element['#id'] . 
    '" value="'. check_plain($element['#value']) .'" '. 
    drupal_attributes($element['#attributes']) .'/>';
} 
```

Styling is open to different designs, but I like the [CSS3 Gradient
Buttons](http://www.webdesignerwall.com/tutorials/css3-gradient-buttons/)
technique from WebDesignerWall for making the primary button vibrant and
eye-catching, and leaving the secondary buttons more washed out in
appearance. The CSS below will produce the example from the screenshot,
with a blue primary button and white/gray secondary ones.

```css
input.button { 
  display: inline-block;
  outline: none;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  font: bold 12px/100% Arial, sans-serif;
  padding: 0.4em 1.5em 0.42em;
  text-shadow: 0 1px 1px rgba(0,0,0,.3);
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  -webkit-box-shadow: 0 1px 2px rgba(0,0,0,.2);
  -moz-box-shadow: 0 1px 2px rgba(0,0,0,.2);
  box-shadow: 0 1px 2px rgba(0,0,0,.2);
  margin-right: 5px;
  color: #606060;
  border: solid 1px #b7b7b7;
  background: #fff;
  background: -webkit-gradient(linear, left top, left bottom, from(#fff), to(#ededed));
  background: -moz-linear-gradient(top,  #fff,  #ededed);
  filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#ededed');
}
input.button:hover {
  background: #ededed;
  background: -webkit-gradient(linear, left top, left bottom, from(#fff), to(#dcdcdc));
  background: -moz-linear-gradient(top,  #fff,  #dcdcdc);
  filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#dcdcdc');
}
input.primaryAction {
  color: #d9eef7;
  border: solid 1px #0076a3;
  background: #0095cd;
  background: -webkit-gradient(linear, left top, left bottom, from(#00adee), to(#0078a5));
  background: -moz-linear-gradient(top,  #00adee,  #0078a5);
  filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr='#00adee', endColorstr='#0078a5');
}
input.primaryAction:hover {
  background: #007ead;
  background: -webkit-gradient(linear, left top, left bottom, from(#0095cc), to(#00678e));
  background: -moz-linear-gradient(top,  #0095cc,  #00678e);
  filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr='#0095cc', endColorstr='#00678e');
}
```

<style type="text/css">
input.button { 
  display: inline-block;
  outline: none;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  font: bold 12px/100% Arial, sans-serif;
  padding: 0.4em 1.5em 0.42em;
  text-shadow: 0 1px 1px rgba(0,0,0,.3);
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  -webkit-box-shadow: 0 1px 2px rgba(0,0,0,.2);
  -moz-box-shadow: 0 1px 2px rgba(0,0,0,.2);
  box-shadow: 0 1px 2px rgba(0,0,0,.2);
  margin-right: 5px;
  color: #606060;
  border: solid 1px #b7b7b7;
  background: #fff;
  background: -webkit-gradient(linear, left top, left bottom, from(#fff), to(#ededed));
  background: -moz-linear-gradient(top,  #fff,  #ededed);
  filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#ededed');
}
input.button:hover {
  background: #ededed;
  background: -webkit-gradient(linear, left top, left bottom, from(#fff), to(#dcdcdc));
  background: -moz-linear-gradient(top,  #fff,  #dcdcdc);
  filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#dcdcdc');
}
input.primaryAction {
  color: #d9eef7;
  border: solid 1px #0076a3;
  background: #0095cd;
  background: -webkit-gradient(linear, left top, left bottom, from(#00adee), to(#0078a5));
  background: -moz-linear-gradient(top,  #00adee,  #0078a5);
  filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr='#00adee', endColorstr='#0078a5');
}
input.primaryAction:hover {
  background: #007ead;
  background: -webkit-gradient(linear, left top, left bottom, from(#0095cc), to(#00678e));
  background: -moz-linear-gradient(top,  #0095cc,  #00678e);
  filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr='#0095cc', endColorstr='#00678e');
}
</style>
<p>
	<input type="submit" class="primaryAction button" value="Save" />
	<input type="submit" class="button" value="Preview" />
	<input type="submit" class="button" value="Delete" />
</p>

