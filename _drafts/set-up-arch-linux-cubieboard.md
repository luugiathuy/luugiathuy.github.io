---
layout: post
title: Set up Arch Linux on Cubieboard 2
description:
categories:
- Hardware
tags:
- cubieboard
- archlinux
published: true
---

## Install Arch Linux: 

- [http://archlinuxarm.org/platforms/armv7/allwinner/cubieboard-2](http://archlinuxarm.org/platforms/armv7/allwinner/cubieboard-2)
- [https://github.com/edwardoid/cubieboard-arch-installer](https://github.com/edwardoid/cubieboard-arch-installer)

## Update to new kernel

    pacman -Syu linux-armv7

## Change hostname:

    hostnamectl set-hostname myhostname

## Set up user account

1. Create an user account and add it to `wheel` group (an administration group, commonly used to give access to the `sudo` and `su` utilities)
    
        useradd -m -G wheel -s /bin/bash <username>

1. Edit `sudoers` list by typing `visudo`, look for the below line and uncomment it to allow wheel group to execute commands. 

        %wheel ALL=(ALL) ALL

1. Allow only users in the group `wheel` to login to `root` using `su` command by edit `/etc/pam.d/su` and uncomment the line:

        # Uncomment the following line to require a user to be in the "wheel" group.
        auth    required  pam_wheel.so use_uid

1. Deny SSH login to `root` account: edit `/etc/ssh/sshd_config`, change `#PermitRootLogin yes` to `no` and uncomment the line:

        PermitRootLogin no

1. Restart the SSH daemon:

        systemctl restart sshd

1. Now we can only log in with the created user account and use `su` or `sudo` to do system administration.

1. More details: [Users and Groups](https://wiki.archlinux.org/index.php/Users_and_groups), [Security](https://wiki.archlinux.org/index.php/Security), [Secure Shell](https://wiki.archlinux.org/index.php/Secure_Shell)

## Set up Access Point on wlan0 interface

1. Install `hostapd` package

        sudo pacman -S hostapd

1. Create file `/etc/hostapd/hostapd.conf`

        interface=wlan0
        bridge=br0
        driver=nl80211
        ssid=cubie1
        hw_mode=g
        channel=11
        macaddr_acl=0
        auth_algs=1
        ignore_broadcast_ssid=0
        wpa=3
        wpa_passphrase=cubiepass
        wpa_key_mgmt=WPA-PSK
        wpa_pairwise=TKIP
        rsn_pairwise=CCMP

1. If you have a card based on RTL8192CU chipset, install `hostapd-8192cu` in the AUR and replace `driver=nl80211` with `driver=rtl871xdrv` and remove `bridge=br0`. See [Install hostapd-8192cu package](#hostapd-8192cu)

1. Install `dnsmasq` package for DHCP server
  
        sudo pacman -S dnsmasq

1. Edit `/etc/dnsmasq.conf` to:

        # disables dnsmasq reading any other files like /etc/resolv.conf for nameservers
        no-resolv
        # Interface to bind to
        interface=wlan0
        # Specify starting_range,end_range,lease_time
        dhcp-range=10.0.0.3,10.0.0.20,12h
        # dns addresses to send to the clients
        server=8.8.8.8
        server=8.8.4.4

1. Initial wlan0 configuration

        sudo ifconfig wlan0 up 10.0.0.1 netmask 255.255.255.0

1. Run `dnsmasq`

        sudo dnsmasq

1. Run `hostapd` as background

        sudo hostapd -B -P /var/run/hostapd.pid /etc/hostapd/hostapd.conf 1> /dev/null

1. More details: [Software Access Point](https://wiki.archlinux.org/index.php/Software_access_point), [hostapd](https://wireless.wiki.kernel.org/en/users/Documentation/hostapd)

## Connect to a Wi-Fi on wlan1 interface

1. Install `wpa_supplicant` package
    
        sudo pacman -S wpa_supplicant
    
1. Configure `wpa_supplicant.conf`

        sudo wpa_passphrase "<ssid>" "<password>" | tee /etc/wpa_supplicant/wpa_supplicant-wlan1.conf > /dev/null

1. Turn on `wlan1` interface
    
        sudo ip link set dev wlan1 up

1. Initialize `wpa_supplicant`

        sudo wpa_supplicant -B -i wlan1 -c /etc/wpa_supplicant/wpa_supplicant-wlan1.conf

1. Obtain IP Adress

        sudo dhcpcd wlan1

1. Enable `systemd` services for connecting Wi-Fi at boot
  
        sudo systemctl enable wpa_supplicant@wlan1
        sudo systemctl enable dhcpcd@wlan1

1. To customize start up script or look for more details, see: [Wireless Network Configuration](https://wiki.archlinux.org/index.php/Wireless_network_configuration#Custom_startup_scripts.2Fservices) and [WPA Suppliant](https://wiki.archlinux.org/index.php/WPA_supplicant)

## <a name="hostapd-8192cu"></a>Install hostapd-8192cu package

1. Install `base-devel` group package

        sudo pacman -S --needed base-devel

1. Create a build directory, for example `~/builds`

        mkdir ~/builds
        cd ~/builds

1. Download `hostapd-8192` tarball and extract it

        curl -L -O https://aur.archlinux.org/packages/ho/hostapd-8192cu/hostapd-8192cu.tar.gz
        tar -xvf hostapd-8192cu.tar.gz
        cd hostapd-8192cu

1. Make the package

        makepkg -s

1. A tarball should have been created with name `hostapd-8192cu-<application version number>-<package revision number>-<architecture>.pkg.tar.xz`

1. Install the created package using `pacman`:

        sudo pacman -U hostapd-8192cu-0.8_rtw_r7475.20130812_beta-3-armv7h.pkg.tar.xz

1. More details: [Arch User Repository](https://wiki.archlinux.org/index.php/Arch_User_Repository), [hostapd-8192cu](https://aur.archlinux.org/packages/hostapd-8192cu/)

