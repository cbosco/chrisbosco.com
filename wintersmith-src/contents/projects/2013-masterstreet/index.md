---
title:      MasterStreet
summary:    Ruby on Rails "full stack" development for an education startup
template:   project.ejs
---

MasterStreet was a small startup focused on continuing education. On the technical side, the team adopted the "full-stack developer" approach where each member is capable of delivering a full feature, at least as a minimum viable product (MVP) experiment for the business.

So, shortly after joining I was enrolled in General Assembly's [10-week Rails course](https://generalassemb.ly/education/back-end-web-development) to quickly ramp up on Ruby on Rails, which in the end helped our first product become very Rails idiomatic.

There were two main Web products built at MasterStreet. The first was a continuing education class search engine. Class information from across over 100 partners was normalized into skills we could run marketing campaigns and build a personalization layer upon. The classes themselves were searchable in an elasticsearch database. We also were pursuing novel ways to enroll in partner classes on our website using [Braintree](https://www.braintreepayments.com/) API integration for eCommerce features.

While the classes search engine was primarily a document-based Rails application, the second product, a tutoring service, was designed to have a more modern and structured front-end using AngularJS. Specifically, the admin interface and tutor onboarding workflows were single-page applications, while the public experience remained a document-based website for simple and intuitive search engine crawling and social sharing. AngularJS proved to be the ideal framework for organizing front-end code across both paradigms, and remains the strongest reason it was chosen over, for example, EmberJS.
