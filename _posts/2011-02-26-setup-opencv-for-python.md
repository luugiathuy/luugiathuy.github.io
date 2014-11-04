---
layout: post
title: Setup OpenCV for Python in Windows
categories:
- OpenCV
tags:
- OpenCV
- Python
published: true
---

I have always struggled when trying to set up OpenCV for Python before. So I
decide to write this post to help myself in the future and share with you =).
My setup is for OpenCV 2.2 but I think you can apply for any version of OpenCV.
<!-- more -->

**Step 1:** Download and install **Python 2.7** from [Python site][Python2.7.2]{:target="_blank"}.
You need to install the *32bit version* of Python. OpenCV currently does not
work with Python 64bit.

**Step 2:** Download and install **OpenCV 2.2** from [OpenCV Sourceforge][OpenCVSourceforge]{:target="_blank"}.
Note that this version only supports Python 2.7 (not 3.x).

**Step 3:** Download and install **NumPy 1.6.1** and **SciPy 0.9.0** from: (you
need tochoose the files which support Python 2.7)

  - [http://sourceforge.net/projects/numpy/files/NumPy/1.6.1/][NumPy]{:target="_blank"}
  - [http://sourceforge.net/projects/scipy/files/scipy/0.9.0][SciPy]{:target="_blank"}

**Step 4:** Setup Windows Path in Environment Variables

  - Add "_**C:/Python2.7;C:/OpenCV2.2/bin**_" to `PATH` variable (You need to
  change the directory to where you install Python and OpenCV).
  - Create `PYTHONPATH` variable and put "_**C:/OpenCV2.2/Python2.7/Lib/site-packages**_"
  as value.

**Update:** For OpenCV2.3, There are two other options for this step:

  - As [Kyle commented below][Kylescomment], you can copy the content of folder
  "**C:opencvbuildpython2.7**" (for opencv 2.2: C:/OpenCV2.2/Python2.7/Lib/site-packages)
  to folder "**>C:Python27Libsite-packages**"
  - **OR**, add these two lines at the beginning of your program:

{% highlight python %}
import sys
sys.path.append("C:OpenCV2.2Python2.7Libsite-packages")
{% endhighlight %}

Yosh!!! You have finished setup OpenCV for Python in Windows. Open Python IDLE,
create a new file, add the program below and run it:

{% highlight python %}
import cv

cv.NamedWindow(&quot;camera&quot;, 1)
capture = cv.CaptureFromCAM(0)

while True:
  img = cv.QueryFrame(capture)
  cv.ShowImage("camera", img)
  if cv.WaitKey(10) == 27:
    break
cv.DestroyWindow("camera")
{% endhighlight %}

(This is the program to show your webcam)

**UPDATE**

1. OpenCV has just released version 2.3.1 which is more stable than 2.2 I think.
You can download it [here][OpenCV2.3.1]{:target="_blank"} and try it (the setup
is same as 2.2).

1. About the black screen you encounter with the example, I think it's because
your camera is not supported. My camera works fine. You can find more information
[here][CameraProblem]{:target="_blank"}.

[Python2.7.2]: http://www.python.org/getit/releases/2.7.2
[OpenCVSourceforge]: http://sourceforge.net/projects/opencvlibrary/files
[NumPy]: http://sourceforge.net/projects/numpy/files/NumPy/1.6.1
[SciPy]: http://sourceforge.net/projects/scipy/files/scipy/0.9.0
[Kylescomment]: http://luugiathuy.com/2011/02/setup-opencv-for-python/#comment-62
[OpenCV2.3.1]: http://sourceforge.net/projects/opencvlibrary/files/opencv-win/2.3.1
[CameraProblem]: http://stackoverflow.com/questions/7247475/opencv-2-3-c-qtgui-problem-initializing-some-specific-usb-devices-and-setups
