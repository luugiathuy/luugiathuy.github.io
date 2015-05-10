---
layout: post
title: Simple Android and Java Bluetooth Application
description:
  A Bluetooth server/client application&#58; A simple client Android app to control a server Java program (using Bluecove) via Bluetooth.
categories:
- Android
- Java
tags:
- android
- bluetooth
- java
published: true
---

Last week was my school's recess week. I had a lot of free time and decided to learn Java and Android Bluetooth by reading the [Bluetooth development guide for Android][AndroidBluetoothGuide]. Then I had an idea to make my Android phone become a simple remote control for my laptop, just for controlling the Power Point slides for presentation. The volume up and volume down become buttons for going to next and previous slide respectively. I write this post to share with you what I have done. I have used Ecipse IDE to write the program.

**REMOTE CONTROL SERVER (Java)**

Firstly, we need to write the remote control server to receive the signal from Android phone. I used a Java library for Bluetooth called [BlueCove][BlueCoveHomepage] to implement the server. You can download the [bluecove-2.1.0.jar][BlueCove2.1.0] file and add it to your external library. Note that **for Linux**, you need to install the `bluez-libs` to your system and add `bluecove-gpl-2.1.0.jar` to external library of the project as well (more information [here][BlueCoveForLinux]).

Here is my *RemoteBluetoothServer* class:

```java
package com.luugiathuy.apps.remotebluetooth;

public class RemoteBluetoothServer{

    public static void main(String[] args) {
        Thread waitThread = new Thread(new WaitThread());
        waitThread.start();
    }
}
```

The main method creates a thread to wait for connection from client and handle the signal.

```java
package com.luugiathuy.apps.remotebluetooth;

import javax.bluetooth.DiscoveryAgent;
import javax.bluetooth.LocalDevice;
import javax.bluetooth.UUID;
import javax.microedition.io.Connector;
import javax.microedition.io.StreamConnection;
import javax.microedition.io.StreamConnectionNotifier;

public class WaitThread implements Runnable {

    /** Constructor */
    public WaitThread() {
    }

    @Override
    public void run() {
        waitForConnection();
    }

    /** Waiting for connection from devices */
    private void waitForConnection() {
        // retrieve the local Bluetooth device object
        LocalDevice local = null;

        StreamConnectionNotifier notifier;
        StreamConnection connection = null;

        // setup the server to listen for connection
        try {
            local = LocalDevice.getLocalDevice();
            local.setDiscoverable(DiscoveryAgent.GIAC);

            UUID uuid = new UUID(80087355); // "04c6093b-0000-1000-8000-00805f9b34fb"
            String url = "btspp://localhost:" + uuid.toString() + ";name=RemoteBluetooth";
            notifier = (StreamConnectionNotifier)Connector.open(url);
        } catch (Exception e) {
            e.printStackTrace();
            return;
        }
                // waiting for connection
        while(true) {
            try {
                System.out.println("waiting for connection...");
                        connection = notifier.acceptAndOpen();

                Thread processThread = new Thread(new ProcessConnectionThread(connection));
                processThread.start();
            } catch (Exception e) {
                e.printStackTrace();
                return;
            }
        }
    }
}
```

In `waitForConnection()` function, firstly it sets up the server by setting the device discoverable, creating the UUID for this application (the client needs this to communicate with server). Then it waits for a connection from a client. When it receives initial connection, it creates a `ProcessConnectionThread` to handle the client's command. Here is the code for `ProcessConnectionThread` class:

```java
package com.luugiathuy.apps.remotebluetooth;

import java.awt.Robot;
import java.awt.event.KeyEvent;
import java.io.InputStream;

import javax.microedition.io.StreamConnection;

public class ProcessConnectionThread implements Runnable {

    private StreamConnection mConnection;

    // Constant that indicate command from devices
    private static final int EXIT_CMD = -1;
    private static final int KEY_RIGHT = 1;
    private static final int KEY_LEFT = 2;

    public ProcessConnectionThread(StreamConnection connection)
    {
        mConnection = connection;
    }

    @Override
    public void run() {
        try {
            // prepare to receive data
            InputStream inputStream = mConnection.openInputStream();

            System.out.println("waiting for input");

            while (true) {
                int command = inputStream.read();

                if (command == EXIT_CMD) {
                    System.out.println("finish process");
                    break;
                }
                processCommand(command);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Process the command from client
     * @param command the command code
     */
    private void processCommand(int command) {
        try {
            Robot robot = new Robot();
            switch (command) {
                case KEY_RIGHT:
                    robot.keyPress(KeyEvent.VK_RIGHT);
                    System.out.println("Right");
                    break;
                case KEY_LEFT:
                    robot.keyPress(KeyEvent.VK_LEFT);
                    System.out.println("Left");
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

The `ProcessConnectionThread` mainly waiting for the client's inputs and process them. This is simple remote control only for going next/previous of Power Point slide so it only process *KEY_RIGHT* and *KEY_LEFT* input. I use *Robot* class from `java.awt.Robot` to generate the key events.

That's all we need for the Remote Control Server. _**When you run the server on a computer, make sure that the Bluetooth is ON.**_

**REMOTE CONTROL CLIENT (Android)**

For the client on Android phone, I have followed the guide from [Android Developer Guide][AndroidBluetoothGuide] and the [sample Bluetooth Chat application][BluetoothChatSample] (You can find this application in the android sdk sample folder).

My program is based on the sample application. The `DeviceListActivity` class is for scanning devices around to find the remote server and connect to it. The `BluetoothCommandService` class is for setting up the connection and sending the command to our Remote Control Server. These two files are similar to the sample application. In BluetoothCommandService, I have removed the `AcceptThread` since the client not need to wait for any connection. The `ConnectThread` is for initializing the connection with server. The `ConnectedThread` is for sending the command to server.

The `RemoteBluetooth` class is our main activity for this application:

```java
protected void onStart() {
    super.onStart();

    // If BT is not on, request that it be enabled.
    // setupCommand() will then be called during onActivityResult
    if (!mBluetoothAdapter.isEnabled()) {
        Intent enableIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
        startActivityForResult(enableIntent, REQUEST_ENABLE_BT);
    }
    // otherwise set up the command service
    else {
        if (mCommandService==null)
            setupCommand();
    }
}

private void setupCommand() {
    // Initialize the BluetoothChatService to perform bluetooth connections
    mCommandService = new BluetoothCommandService(this, mHandler);
}
```

The `onStart()` function to check whether the bluetooth on our phone is enabled or not. If not, it creates an Intent to turn the bluetooth on. The `setupCommand()` to create `BluetoothCommandService` object to send the command when we push the Volume Up and Down buttons:

```java
public boolean onKeyDown(int keyCode, KeyEvent event) {
    if (keyCode == KeyEvent.KEYCODE_VOLUME_UP) {
        mCommandService.write(BluetoothCommandService.VOL_UP);
        return true;
    }
    else if (keyCode == KeyEvent.KEYCODE_VOLUME_DOWN){
        mCommandService.write(BluetoothCommandService.VOL_DOWN);
        return true;
    }

    return super.onKeyDown(keyCode, event);
}
```

That's it. Now we can run the server, install the application to the phone and run it :-)

You can go to [my GitHub][Remote-Bluetooth-Android-GitHub] to download the project for client and server.

**Update:** I developed this application using android sdk 2.1. And as comments below, the application is not working with Android SDK 3.x. I don't have Android tablet to test it yet. Sorry about that.

[AndroidBluetoothGuide]: http://developer.android.com/guide/topics/wireless/bluetooth.html
[BlueCoveHomepage]: http://bluecove.org
[BlueCove2.1.0]: http://sourceforge.net/projects/bluecove/files/BlueCove/2.1.0
[BlueCoveForLinux]: http://bluecove.org/bluecove-gpl
[BluetoothChatSample]: http://developer.android.com/resources/samples/BluetoothChat/index.html
[Remote-Bluetooth-Android-GitHub]: https://github.com/luugiathuy/Remote-Bluetooth-Android
