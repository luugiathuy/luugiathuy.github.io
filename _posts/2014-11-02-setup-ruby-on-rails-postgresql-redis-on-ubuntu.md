---
layout: post
title: Setup Ruby on Rails, PostgreSQL and Redis on Ubuntu
categories:
- DevOps
tags:
- ruby on rails
- rails
- postgresql
- redis
- ubuntu
published: true
---

In this post, I will share with you how I set up a Ruby on Rails, PostgreSQL and
Redis on Ubuntu for deploying Rails applications from scratch.

## Ruby

### Update Ubuntu packages

    sudo apt-get update
    sudo apt-get upgrade
    sudo apt-get dist-upgrade

After updating, you may have to restart your server for the changes.<!-- more -->

### Install Ruby Version Manager (RVM)

I use RVM to install and manage Ruby versions. To install the latest stable
version of RVM, use:

    curl -L get.rvm.io | bash -s stable

Then load RVM to bash:

    source ~/.rvm/scripts/rvm

Install required packages for RVM:

    rvm requirements

### Install Ruby

Check [Ruby website](https://www.ruby-lang.org/en){:target="_blank"} for the
latest Ruby version, then install:

    rvm install 2.2.0

where `2.2.0` is the Ruby version you want to install. This will take a while as it
downloads and compiles Ruby on your system. It also install the latest
[RubyGems](http://rubygems.org){:target="_blank"} for you.

That's it. Now you can download your Rails application and run it on the server.
You can skip the below setups (PostgreSQL, Redis) if you want.

## PostgreSQL

### Install

Install the latest version of PostgreSQL for Ubuntu via:

    sudo apt-get install postgresql

Check the version:

    psql --version

If you have any warning like `perl: warning: Setting locale failed.` (more details
[here](http://stackoverflow.com/questions/2499794/how-can-i-fix-a-locale-warning-from-perl){:target="_blank"}), use:

    export LC_CTYPE=en_US.UTF-8
    export LC_ALL=en_US.UTF-8

By default, PostgresSQL will automatically run on your server after install, however
we want to use our own data directory. To stop the default server, use:

    sudo service postgresql stop

### Setup data directory

After installing, you should create the PostgreSQL user which your Rails application
will use to access the database:

    sudo useradd postgres
    sudo passwd postgres

Now, create the PostgreSQL data directory. The standard path is
`/var/lib/postgresql/9.4/data` or `/usr/local/pgsql/data`:

    sudo mkdir /var/lib/postgresql/9.4/data

where `9.4` is the version of your installed PostgreSQL. After that, add
privileges for `postgres` user:

    sudo chown postgres:postgres /var/lib/postgresql/9.4/data

Initialize the data directory:

    su postgres
    /usr/lib/postgresql/9.4/bin/initdb -D /var/lib/postgresql/9.4/data

Then, start PostgreSQL server with your created data directory:

    /usr/lib/postgresql/9.4/bin/pg_ctl -D /var/lib/postgresql/9.4/data start

### Integrate with Rails app

To create your database for Rails app, open PosgreSQL interactive terminal:

    su postgres
    psql

Then:

    create database <your-database-name>;
    \q
    exit

Install `libpg-dev` package to be able to install `pg` gem via `bundle install`:

    sudo apt-get install libpq-dev

## Redis

Follow the instruction on [Redis download page](http://redis.io/download) to
install Redis on Ubuntu:

    wget http://download.redis.io/releases/redis-2.8.17.tar.gz
    tar xzf redis-2.8.17.tar.gz
    cd redis-2.8.17
    make
    sudo make install

Here is my Redis configuration file [redis.conf](https://gist.github.com/luugiathuy/1aeb716645eb729973d3){:target="_blank"}, run it:

    redis-server redis.conf

To use Redis with your Rails application, add `redis`, `redis-store`, `redis-rails`
to your Gemfile.
