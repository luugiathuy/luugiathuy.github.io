---
layout: post
title: Set up Qt for Visual Studio 2008
categories:
- C++
tags:
- qt
- visual studio
published: true
---

My upcoming project will need to work with Qt. Our team have decided to not use Qt Creator for the project. We use Visual Studio 2008 since it is easy to configure and all members are familiar with it. In this post, I will share with you how to configure Qt for visual studio 2008.<!-- more -->

**_Step 1_**: Make sure Visual Studio 2008 has been updated to **SP1**. You can download the update file from [Microsoft][VisualStudio2008SP1]{:target="_blank"}

**_Step 2_**: Download and install the latest Qt library for Visual Studio from [Qt site][QtVisualStudio2008]{:target="_blank"}

**_Step 3_**: Set up Windows Path in Environment Variables

  1. In System Variables, create new variable named `QTDIR` and its value is the directory which Qt is installed (`C:\Qt4.7.3` in my case).

  2. Add `;%QTDIR%bin` to the `PATH` variable.

**_Step 4_**: Download and install Qt add-in for Visual Studio from [Qt site][QtVS2008AddIn]{:target="_blank"}

That's all we need to set up Qt for Visual Studio :-). Now you can open visual studio, select New Project..., we can see the **Qt4 Projects** in the list and choose the type of project we want to create:

![](/images/qtnewproject.jpg)

Then in the next step, we will need to select the Qt libraries to include in the project. Most often we will use GUI library, OpenGL library and XML library:

![](/images/qtnewprojectsetup.jpg)

Visual Studio automatically create the project and configure Qt for you. All you need now is code what you want :-D Hope it will help you!

[VisualStudio2008SP1]: http://www.microsoft.com/download/en/details.aspx?id=13276
[QtVisualStudio2008]: http://download.qt-project.org/official_releases/qt/4.8/4.8.6/qt-opensource-windows-x86-vs2008-4.8.6.exe
[QtVS2008AddIn]: http://download.qt-project.org/official_releases/vsaddin/qt-vs-addin-1.1.11-opensource.exe
