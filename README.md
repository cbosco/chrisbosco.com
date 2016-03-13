# chrisbosco.com source

Code behind my personal site, [cbosco.github.com](https://github.com/cbosco/cbosco.github.com).

## How to deploy the site

Install `broccoli-cli`

    npm install -g broccoli-cli

Install dependencies

    npm install

Run deploy script

    ./deploy.sh

Then run some sort of HTTP server in the *cbosco.github.com* directory, e.g.:

    python -m SimpleHTTPServer 8080


## About

Built with [Broccoli](https://github.com/broccolijs/broccoli) and [Wintersmith](http://wintersmith.io/)

Based on [baz](http://github.com/cbosco/baz) application template

## Developing

### AMP

To validate the site from AMP perspective, append `#development=1` to a URL, e.g. http://localhost:8080/projects/2011-aviary-photo-editor/#development=1

AMP validation problem: external CSS (SCSS). Inline with Webpack
