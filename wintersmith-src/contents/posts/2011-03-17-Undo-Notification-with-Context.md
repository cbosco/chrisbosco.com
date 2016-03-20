---
title: Undo Notification with Context
template:   post.ejs
Date: 2011-03-17	
Slug: Undo-Notification-with-Context
Tags: UI Patterns
Abstract: Toward the end of a recent post at The UI Observatory, there's a nice discussion about Undo/Redo in Pixelmator (an image editing app). Pixelmator actually messages you the type of action you've just undone or redone, front-and-center. This feature would be handy any time you find yourself creating or editing, as long as it's sufficiently out of the way when it needs to be. This could be especially useful on the web, where HTML editors generally hijack context from the browser and it's easy for the context of Undo/Redo to change with a few mouse clicks. 
---

Toward the end of a recent post at [The UI
Observatory](http://uiobservatory.com/2011/cancel-is-not-just-for-dialogs/),
there's a nice discussion about Undo/Redo in
[Pixelmator](http://www.pixelmator.com/) (an image editing app).
Pixelmator actually messages you the type of action you've just undone
or redone, front-and-center. This feature would be handy any time you
find yourself creating or editing, as long as it's sufficiently out of
the way when it needs to be. This could be especially useful on the web,
where HTML editors generally hijack context from the browser and it's
easy for the context of Undo/Redo to change with a few mouse clicks.

![HTML editor: undo
notification](http://projects.cbsides.com/blog/demo/ui_patterns/editor_undo_notification.png)

Admittedly there are difficulties in implementing this, but the more
fully featured HTML editors bubble Undo/Redo into their UI as buttons -
it's not a stretch to think that any actions taken on the editor could
be captured and saved in a library of actions with appropriate labels,
with fallback messaging for the case where information is lost or
unavailable such as "undid edit text" in order to fail gracefully.

I'm sure plenty of other types of applications could benefit from a
dictionary of actions exposed as a history log as well as unobtrusive
notifications.
