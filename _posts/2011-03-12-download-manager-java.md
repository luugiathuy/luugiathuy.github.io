---
layout: post
title: File Download Manager in Java
description:
  A download manager program written in Java which can pause/resume as well as parallel download multiple files.
categories:
- Java
tags:
- download manager
- java
published: true
---

Download manager is a program that helps us download files from Internet efficiently.The program can pause or resume downloads. It also can split the files to be downloaded into 2 or more segments, which are processed in parallel, making the download faster.In this post, I will share with you how I write a download manager program in Java with those features.

**Simple Download Thread**

To download a file, we need to create a thread to handle the download so that it will not intercept the GUI thread. Here is the code for run() method of the download thread. It is quite simple.

```java
public void run() {
  BufferedInputStream in = null;
  RandomAccessFile raf = null;

  try {
    // open Http connection to URL
    HttpURLConnection conn = (HttpURLConnection)mURL.openConnection();
    // connect to server
    conn.connect();

    // Make sure the response code is in the 200 range.
    if (conn.getResponseCode() / 100 != 2) {
      error();
    }

    // get the input stream
    in = new BufferedInputStream(conn.getInputStream());

    // open the output file and seek to the start location
    raf = new RandomAccessFile(mOutputFile, "rw");

    byte data[] = new byte[BUFFER_SIZE];
    int numRead;
    while((mState == DOWNLOADING) && ((numRead = in.read(data,0,BUFFER_SIZE)) != -1))
    {
      // write to buffer
      raf.write(data,0,numRead);
    }

  } catch (IOException e) {
    error();
  } finally {
    if (raf != null) {
      try {
        raf.close();
      } catch (IOException e) {}
    }

    if (in != null) {
      try {
        in.close();
      } catch (IOException e) {}
    }
  }
}
```

The `BUFFER_SIZE` (in bytes) should be multiple of the block size of your hard disk. Usually we use 4096 or 8192. As I comment in the code, firstly we open the connection to the server and get the input stream to read the file. Then we have a while loop to read and write a number of bytes of file to disk.

**Parallel Downloading**

To download multiple parts of a file parallelly, we need to create multiple threads. Each thread is implemented similarly to the simple thread above, except that it needs to download only a part of the downloaded file. To do that, the `HttpURLConnection` or its super class `URLConnection` provides us method `setRequestProperty` to set the range of the bytes we want to download.

```java
// open Http connection to URL
HttpURLConnection conn = (HttpURLConnection)mURL.openConnection();

// set the range of byte to download
String byteRange = mStartByte + "-" + mEndByte;
conn.setRequestProperty("Range", "bytes=" + byteRange);

// connect to server
conn.connect();
```

The first thread has the value of `mStartByte = 0` while the value of `mEndByte` of the last thread is the file size (in bytes). When we set the range of the bytes, the server only sends that specific segment of the file, hence the `BufferInputStream` just read normally. I also think that it is good if the size of each part we download is a multiple of block size of hard disk (which is usually 4092).

**Resume/Pause download**

To support resume/pause feature, every time the threads read and write to the buffer, we increase the `mStartByte` variable to the number of bytes we read. So, if the download is paused and resumed later, we can use it to set the range of byte request to the server as above. Here is the full run() function of downloading thread:

```java
public void run() {
  BufferedInputStream in = null;
  RandomAccessFile raf = null;

  try {
    // open Http connection to URL
    HttpURLConnection conn = (HttpURLConnection)mURL.openConnection();

    // set the range of byte to download
    String byteRange = mStartByte + "-" + mEndByte;
    conn.setRequestProperty("Range", "bytes=" + byteRange);
    System.out.println("bytes=" + byteRange);

    // connect to server
    conn.connect();

    // Make sure the response code is in the 200 range.
        if (conn.getResponseCode() / 100 != 2) {
            error();
        }

    // get the input stream
    in = new BufferedInputStream(conn.getInputStream());

    // open the output file and seek to the start location
    raf = new RandomAccessFile(mOutputFile, "rw");
    raf.seek(mStartByte);

    byte data[] = new byte[BUFFER_SIZE];
    int numRead;
    while((mState == DOWNLOADING) && ((numRead = in.read(data,0,BUFFER_SIZE)) != -1))
    {
      // write to buffer
      raf.write(data,0,numRead);
      // increase the startByte for resume later
      mStartByte += numRead;
      // increase the downloaded size
      downloaded(numRead);
    }

    if (mState == DOWNLOADING) {
      mIsFinished = true;
    }
  } catch (IOException e) {
    error();
  } finally {
    if (raf != null) {
      try {
        raf.close();
      } catch (IOException e) {}
    }

    if (in != null) {
      try {
        in.close();
      } catch (IOException e) {}
    }
  }

  System.out.println("End thread " + mThreadID);
}
```

Note that, before the InputStream read the file, the output file (type of `RandomAccessFile`) need to seek to the `mStartByte` position of the file, then it will start writing at that position.

That's my simple download manager program. There are more download manager's features such as scheduling a download, integrating with web browsers, supporting https download etc.

You can download my program at [my GitHub][DownloadManagerGitHub] :-)

[DownloadManagerGitHub]: https://github.com/luugiathuy/Java-Download-Manager
