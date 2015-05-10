---
layout: post
title: Setup nginx and puma for Rails apps on Ubuntu
description:
  A step by step guide how to configure nginx and puma to deploy Rails application on Ubuntu server.
categories:
- Rails
tags:
- ruby on rails
- rails
- nginx
- puma
published: true
---

Continue from previous post [Setup Ruby on Rails, PostgreSQL and Redis on Ubuntu]({% post_url 2014-11-02-setup-ruby-on-rails-postgresql-redis-on-ubuntu %}), in this post I will share with you how I set up nginx and puma to deploy my Rails application on Ubuntu server.

## NGINX

### Installation

    sudo apt-get update
    sudo apt-get install nginx

### Configuration

Disable default site by removing the symlink in folder `/etc/nginx/site-enabled`:

    sudo rm /etc/nginx/site-enabled/default

Now let's create your new virtual host config file `/etc/nginx/sites-available/example.com` for your Rails app:

{% gist luugiathuy/723280a597c4cbf30884 %}

I have used the unix socket `unix:///tmp/app_name.sock` to bind it with **puma** later. If you use ssl for your host, you can use this [configuration](https://gist.github.com/luugiathuy/9054e96f2eb6d9773dbc)

Next, we enable this configuration by creating a symlink in `/etc/nginx/site-enabled`

    sudo ln -sf /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/example.com

Then restart nginx server to apply these changes:

    sudo service nginx restart

## PUMA

### Installation

Add `gem 'puma'` to the *Gemfile* of your Rails application.

### Run

Start your app server

    cd /rails/app/folder/
    puma -e production -d -b unix:///tmp/app_name.sock --pidfile /tmp/puma.pid

To verify whether the puma process is running:

    ps aux | grep puma

To stop the app server

    kill -s SIGTERM `cat /tmp/puma.pid`
