---
layout: post
title: Rails&#58; Guardfile for RSpec
description:
  In this post, I share with you my `Guardfile` for gem `guard-spec` which I
  used for my Rails apps to automatically rerun specs when there are changes.
categories:
- Rails
tags:
- ruby on rails
- rails
- rspec
published: true
---

In this post, I share with you my `Guardfile` for gem `guard-spec` which I
used for my Rails apps to automatically rerun specs when there are changes.

To install `guard-spec`, check out its 
[GitHub site](https://github.com/guard/guard-rspec){:target="_blank"}

<!-- more -->After running the command `guard init rspec`, replace the generated
Guardfile with:

{% gist luugiathuy/8f91cb06870b7a672530 %}