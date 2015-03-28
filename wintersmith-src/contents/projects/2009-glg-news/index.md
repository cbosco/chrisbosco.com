---
title:      GLG News
summary:    Content-generation website for subject matter experts
template:   project.ejs
---
GLG News is a website built in ASP.NET MVC where users who provide
expertise are empowered to give their take on a current topic in the
news and have it published to GLG's public website (link). This gives
prospective clients a sample of the kind of expertise GLG makes
available through paid membership, while also lifting the author's own
profile on the web through the GLG brand.

The site provides rich text editing tools for authors to compose their
analysis. A delicate balance has to be struck in terms of features
available to content creators and consistency to be upheld on the
reading experience on the other end. While we want to cater to every
request from the content generator, care has to be taken to limit
potentially destructive HTML and styles from making it through the UI.

FCKeditor, a third party rich text editor plugin, was used as the base
of the text editors in GLG News, which are then themed and extended to
allow for inline spellchecking. In a final proofreading step, the author
is allowed to refine companies and stock tickers detected in the
article, helping to make it more discoverable. Authors can also link to
their Twitter or Facebook account to notify their friends and followers
when each analysis has been posted.
