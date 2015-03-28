---
title:      The Shoshin Project
summary:    Multimedia site on a single page with client-side routing
template:   project.ejs
---
The Shoshin Project is a CMS-driven media website that contains
interviews and analysis from industry leaders collected into editions by
theme. The creative direction is a brochure-like experience with
graceful transitions between pages and navigation states. In order to
deliver that experience, The Shoshin Project is a single-page web app in
a browser, driven entirely by JavaScript. I built the JavaScript
architecture behind the site and helped design the transitions between
states.

Navigation works via a `hashchange` event which is a change in the
location bar detected by the browser, not the server. On every
`hashchange`, an appropriate JavaScript controller gets called based on
some simple routing rules. The request is checked against a growing
cache of data on the client, and if it's not there it is fetched from a
web service and delivered as JSON, subsequently cached. The data then
hydrates jQuery HTML templates and appends these new elements to the
page, revealing them through transitions

The Shoshin Project also serves as a technical prototype in the
direction of HTML5 mobile web apps, where a page refresh is an expensive
action, and data should be pulled from the server only as needed and
cached aggressively due to connectivity and bandwidth limitations.

There is certainly an SEO concern with a JavaScript-driven website, and
this is mitigated by following Google's AJAX crawling standard and
providing fallback HTML snapshots of the web pages to search engines.
The AJAX crawling convention from Google is gaining traction and has
been implemented by sites such as Twitter and Facebook.

*[Serbo-Croatian](http://science.webhostinggeeks.com/projekat-shoshin) translation available courtesy of Jovana Milutinovich from [WebHostingGeeks.com](http://webhostinggeeks.com/)*
