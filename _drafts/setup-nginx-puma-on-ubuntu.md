---
layout: post
title: Setup nginx and puma for Rails apps on Ubuntu
categories:
- Rails
tags:
- ruby on rails
- rails
- nginx
- puma
published: false
---

Continue from previous post, in this post I will share with you how I set up
nginx and puma for my Rails apps.

## NGINX

    sudo apt-get update
    sudo apt-get install nginx

Disable default site by removing the symlink:

    sudo rm /etc/nginx/site-enabled/default

Now let's create your new virtual host config file
`/etc/nginx/sites-available/example.com` for your Rails app, and using this:

and we enable it by creating symlink in `/etc/nginx/site-enabled`

    sudo ln -sf /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/example.com

Restart nginx server:

    sudo service nginx restart

## PUMA

Start your app server

    puma -e production -d -b unix:///tmp/your_app.sock --pidfile /tmp/puma.pid

To stop the app server

    kill -s SIGTERM `cat /tmp/puma.pid`
