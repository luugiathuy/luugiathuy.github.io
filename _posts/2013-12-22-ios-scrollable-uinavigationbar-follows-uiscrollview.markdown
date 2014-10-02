---
layout: post
title: iOS scrollable UINavigationBar follows UIScrollView
categories:
- iOS
tags:
- ios
- scroll
- uinavigationbar
- uiscrollview
status: publish
type: post
published: true
---

Inspired by the navigation bar functionality seen in Chrome, Facebook and Instagram iOS apps which it can shrink or expand based on the scrolling of a UIScrollView object such as UITableView, I have coded a custom navigation bar, called GTScrollNavigationBar at [https://github.com/luugiathuy/GTScrollNavigationBar][GTScrollNavigationBar-github]{:target="_blank"}

Screenshots:

![](http://luugiathuy.com/wp-content/uploads/2013/12/GTScrollNavigationBar1.png)
![](http://luugiathuy.com/wp-content/uploads/2013/12/GTScrollNavigationBar2.png)

The GTScrollNavigationBar class inherits UINavigationBar and has a scrollView property which the GTScrollNavigationBar object will follow the scrolling. When setting the scrollView property, GTScrollNavigationBar will add a UIPanGestureRecognizer to the scrollView and have a function called `handlePan:` to handle the gesture.

In `setScrollView:` function:

{% highlight objective-c %}
if (self.panGesture.view) {
  [self.panGesture.view removeGestureRecognizer:self.panGesture];
}
[scrollView addGestureRecognizer:self.panGesture];
{% endhighlight %}

Then in the `handlePan:` function, the GTScrollNavigationBar is scrolled up or down by adjusting its `frame.origin.y` based on the change in `contentOffset` property of the scrollview. The reason why I choose this instead of the translation of the panGesture is that we want the scrolling of the navigation bar is aligned with UIScrollView's one. Besides it can check whether `contentOffset.y < 0` so that the the navigation bar won't be scrolled.

The title, back button and other views in navigation bar is also faded in/out when the navigation bar is scrolled. It is done by adjusting their `alpha` property based on the position of the navigation bar.

That's it :) You can read the README file at [https://github.com/luugiathuy/GTScrollNavigationBar][GTScrollNavigationBar-github]{:target="_blank"} to set up the GTScrollNavigationBar in your project or view the example in the project.

[GTScrollNavigationBar-github]: https://github.com/luugiathuy/GTScrollNavigationBar
