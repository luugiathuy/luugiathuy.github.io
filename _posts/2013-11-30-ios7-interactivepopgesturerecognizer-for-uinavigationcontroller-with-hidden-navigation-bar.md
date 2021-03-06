---
layout: post
title: iOS7 interactivePopGestureRecognizer for hidden navigation bar
description:
  A trick for iOS7 interactivePopGestureRecognizer method with hidden navigation bar.
categories:
- iOS
tags:
- ios
- uinavigationbar
- uinavigationcontroller
published: true
---

iOS7 introduces interactivePopGestureRecognizer property which is used for popping current view controller stack by a gesture (swipe right gesture from left edge as default). However if the navigation bar is hidden or the app uses a custom back button for navigation bar, this feature will not work. A bit lines of code can make this feature works again for those cases. In `viewDidLoad()` of view controller (or `application:didFinishLaunchingWithOptions:` of AppDelegate), we set the `interactivePopGestureRecognizer.delegate` to `nil` as below:

```objective-c
if (floor(NSFoundationVersionNumber) > NSFoundationVersionNumber_iOS_6_1) {
  self.navigationController.interactivePopGestureRecognizer.delegate = nil;
}
```
