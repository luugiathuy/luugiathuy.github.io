---
layout: post
title: Setup OpenCV for Python in Windows
description: 
  A step by step guide on how to set up OpenCV for Python 2.7 with NumPy, SciPy on Windows. A simple webcam demo.
categories:
- OpenCV
tags:
- OpenCV
- Python
published: true
---

I have always struggled when trying to set up OpenCV for Python before. So I decide to write this post to help myself in the future and share with you =). My setup is for OpenCV 2.2 but I think you can apply for any version of OpenCV.

**Step 1:** Download and install **Python 2.7** from [Python site][Python2.7.2]. You need to install the *32bit version* of Python. OpenCV currently does not work with Python 64bit.

**Step 2:** Download and install **OpenCV 2.2** from [OpenCV Sourceforge][OpenCVSourceforge]. Note that this version only supports Python 2.7 (not 3.x).

**Step 3:** Download and install **NumPy 1.6.1** and **SciPy 0.9.0** from: (you need to choose the files which support Python 2.7)

  - [http://sourceforge.net/projects/numpy/files/NumPy/1.6.1/][NumPy]
  - [http://sourceforge.net/projects/scipy/files/scipy/0.9.0][SciPy]

**Step 4:** Setup Windows Path in Environment Variables

  - Add "_**C:/Python2.7;C:/OpenCV2.2/bin**_" to `PATH` variable (You need to change the directory to where you install Python and OpenCV).
  - Create `PYTHONPATH` variable and put "_**C:/OpenCV2.2/Python2.7/Lib/site-packages**_" as value.

**Update:** For OpenCV2.3, There are two other options for this step:

  - As Kyle commented below, you can copy the content of folder "**C:/opencv/build/python2.7**" (for opencv 2.2: C:/OpenCV2.2/Python2.7/Lib/site-packages) to folder "**C:/Python27/Lib/site-packages**"
  - **OR**, add these two lines at the beginning of your program:

        import sys
        sys.path.append("C:/OpenCV2.2/Python2.7/Lib/site-packages")

Yosh!!! You have finished setup OpenCV for Python in Windows. Open Python IDLE, create a new file, add the program below and run it:

```python
import cv

cv.NamedWindow(&quot;camera&quot;, 1)
capture = cv.CaptureFromCAM(0)

while True:
  img = cv.QueryFrame(capture)
  cv.ShowImage("camera", img)
  if cv.WaitKey(10) == 27:
    break
cv.DestroyWindow("camera")
```

(This is the program to show your webcam)

**UPDATE**

1. OpenCV has just released version 2.3.1 which is more stable than 2.2 I think. You can download it [here][OpenCV2.3.1] and try it (the setup is same as 2.2).

1. About the black screen you encounter with the example, I think it's because your camera is not supported. My camera works fine. You can find more information [here][CameraProblem].

[Python2.7.2]: http://www.python.org/getit/releases/2.7.2
[OpenCVSourceforge]: http://sourceforge.net/projects/opencvlibrary/files
[NumPy]: http://sourceforge.net/projects/numpy/files/NumPy/1.6.1
[SciPy]: http://sourceforge.net/projects/scipy/files/scipy/0.9.0
[OpenCV2.3.1]: http://sourceforge.net/projects/opencvlibrary/files/opencv-win/2.3.1
[CameraProblem]: http://stackoverflow.com/questions/7247475/opencv-2-3-c-qtgui-problem-initializing-some-specific-usb-devices-and-setups
