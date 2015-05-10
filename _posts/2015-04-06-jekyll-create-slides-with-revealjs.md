---
layout: post
title: Jekyll&#58; Create Slides with reveal.js
description:
  reveal.js enables you to create beautiful interactive slide decks using HTML.
  This presentation will show you how to integrate it with Jekyll to create
  slide pages.
categories:
- Jekyll
tags:
- jekyll
- revealjs
published: true
---

[reveal.js](https://github.com/hakimel/reveal.js/) is a framework for creating interactive slide using HTML. It has many useful features, including Markdown content, PDF export and speaker notes. You can check out its [live demo](http://lab.hakim.se/reveal-js). In this post I will share with you how to integrate reveal.js to Jekyll site.

## reveal.js

Clone `reveal.js` to your site's root folder:

    git clone https://github.com/hakimel/reveal.js.git

or if you use git for your site. Add `reveal.js` as its submodule:

    git submodule add https://github.com/hakimel/reveal.js.git

## Slide Layout

Now we create a layout for slide pages. Create a new file, called `slide.html` in `_layouts` folder, then paste this content to the new file:

{% gist luugiathuy/c07ac5608addadb642e5 %}

This layout is based on the [index.html](https://github.com/hakimel/reveal.js/blob/master/index.html) file of the live demo. I have added in some Liquid code to get the title, author, description as well as the theme and slide transition from the page YAML front matter.

## Example

You can checkout [my slide](/slides/jekyll-create-slides-with-revealjs) of this post. Here is the YAML front matter of the page:

```yaml
---
layout: slide
title: Jekyll&#58; Make presentation page with reveal.js
description: A presentation slide for how to use reveal.js in Jekyll
theme: black
transition: slide
---
```

Each slide is enclosed in a `<section>` tag. Here is an example slide using markdown:

```html
<section data-markdown>
## Overview

[reveal.js](https://github.com/hakimel/reveal.js/) enables you to create
beautiful interactive slide decks using HTML. This presentation will show you
how to integrate it with [Jekyll](http://jekyllrb.com/)
</section>
```

- - -

That's it, you can check more slide examples, configurations of reveal.js at its site.
