---
layout: post
title: Simple Web Proxy Python
categories:
- Python
tags:
- proxy
- Python
published: true
---

When I was in year 3, I studied the module "Computer Network 2". There was an
assignment about implementation of a simple web proxy. In this post, I will
share with you my program for the assignment (written in Python).

The proxy sits between the client (usually web browser) and the server (web
server). In our simple case, the client sends all its requests to the proxy
instead of sending requests directly to the server. The proxy then opens a
connection to the server, and passes on the client’s request.<!-- more -->
Then when the proxy receives the reply from the server, it sends that reply
back to the client. There are several reasons we use proxy for our browser:
Performance (the proxy caches the pages that it fetched), Content Filtering and
Transformation (block access to certain domain, reformat web pages), and Privacy.
In my program, I do not implement these features. Here is the main function of
the program:

{% highlight python %}
import os,sys,thread,socket

#********* CONSTANT VARIABLES *********
BACKLOG = 50            # how many pending connections queue will hold
MAX_DATA_RECV = 4096    # max number of bytes we receive at once
DEBUG = False           # set to True to see the debug msgs

#********* MAIN PROGRAM ***************
def main():

  # check the length of command running
  if (len(sys.argv) < 2):
    print "usage: proxy <port>"
    return sys.stdout

  # host and port info.
  host = ''               # blank for localhost
  port = int(sys.argv[1]) # port from argument

  try:
    # create a socket
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # associate the socket to host and port
    s.bind((host, port))

    # listenning
    s.listen(BACKLOG)

  except socket.error, (value, message):
    if s:
        s.close()
    print "Could not open socket:", message
    sys.exit(1)

  # get the connection from client
  while 1:
    conn, client_addr = s.accept()

    # create a thread to handle request
    thread.start_new_thread(proxy_thread, (conn, client_addr))

  s.close()

if __name__ == '__main__':
  main()
{% endhighlight %}

In the main function, we create a socket to listen requests from client (web
browser). The port of the socket is the command argument of the program. Since
the proxy needs to handle multiple clients at the same time, we need to
implement multi-threading for it. Whenever the proxy received a request from
client, it creates a thread to handle the request
`thread.start_new_thread(proxy_thread, (conn, client_addr))`. Below is the code
for `proxy_thread()` function:

{% highlight python %}
def proxy_thread(conn, client_addr):

  # get the request from browser
  request = conn.recv(MAX_DATA_RECV)

  # parse the first line
  first_line = request.split('n')[0]

  # get url
  url = first_line.split(' ')[1]

  if (DEBUG):
    print first_line
    print
    print "URL:", url
    print

  # find the webserver and port
  http_pos = url.find("://")          # find pos of ://
  if (http_pos==-1):
    temp = url
  else:
    temp = url[(http_pos+3):]       # get the rest of url

  port_pos = temp.find(":")           # find the port pos (if any)

  # find end of web server
  webserver_pos = temp.find("/")
  if webserver_pos == -1:
    webserver_pos = len(temp)

  webserver = ""
  port = -1
  if (port_pos==-1 or webserver_pos < port_pos):      # default port
    port = 80
    webserver = temp[:webserver_pos]
  else:       # specific port
    port = int((temp[(port_pos+1):])[:webserver_pos-port_pos-1])
    webserver = temp[:port_pos]

  print "Connect to:", webserver, port

  try:
    # create a socket to connect to the web server
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((webserver, port))
    s.send(request)         # send request to webserver

    while 1:
      # receive data from web server
      data = s.recv(MAX_DATA_RECV)

      if (len(data) > 0):
        # send to browser
        conn.send(data)
      else:
        break
    s.close()
    conn.close()
  except socket.error, (value, message):
    if s:
      s.close()
    if conn:
      conn.close()
    print "Runtime Error:", message
    sys.exit(1)
{% endhighlight %}

The `proxy_thread` function firstly parse the web server URL and port (if the
port is not defined, default port 80 will be used). For example, the first line
of the request from client is `GET http://www.google.com/ HTTP/1.1` we need to
parse the URL `www.google.com`. When the URL is ready, the proxy just create a
connection to server using the URL, send the request to it to receive back
resulted web page and then send the web page to web browser.

Yosh! we have done a simple web proxy. For advanced features, the web proxy
needs to handle **https** requests, allow user login to websites. I have
attached my program below the post. To run the program, use `python proxy.py 9876`
where 9876 is the port number of the proxy. For the web browser, you need to
configure proxy for it (hostname and port).

The source code of the proxy can be downloaded at [my GitHub][WebProxyPythonGitHub]{:target="_blank"}. Hope you enjoy this post! =]

[WebProxyPythonGitHub]: https://github.com/luugiathuy/WebProxyPython
