---
title:      AutoGraphs
summary:    Graphical car comparison with the HTML canvas tag
template:   project.ejs
---
AutoGraphs is a tool for comparing up to three cars visually by physical
dimensions (something that may be handy for those who have to park in
tight spaces). It also compares along the more common metrics such as
fuel economy and performance, through interactive graphs and charts.

AutoGraphs is an early experiment with the HTML `canvas` tag. HTML
`canvas` allows you to draw shapes programmatically with JavaScript and
was shortly after popularized by the [Google
Chrome](http://www.chromeexperiments.com/ "Chrome Experiments") browser
and HTML5 spec. At the time I was becoming too comfortable with the
MooTools JavaScript framework so I wanted to build something
sophisticated in vanilla JavaScript without relying on a toolkit. The
downside of this is AutoGraphs is relatively devoid of animation or
slick transitions. It is however progressively enhanced from a simple
tabular comparison in browsers without `canvas` support that can also be
activated by choice for the visually impaired. It is driven by JSON data
over XHR (AJAX) but the core functionality is accessible without
JavaScript enabled.
