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

## Set up Access Point on wlan0 interface

1. Install `hostapd` package

        pacman -S hostapd

1. Create file `/etc/hostapd/hostapd.conf`

        nterface=wlan0
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

        ifconfig wlan0 up 10.0.0.1 netmask 255.255.255.0

1. Run `dnsmasq`

        dnsmasq

1. Enable `systemd` service for hostapd

        systemctl enable hostapd

1. More details: [Software Access Point](https://wiki.archlinux.org/index.php/Software_access_point), [hostapd](https://wireless.wiki.kernel.org/en/users/Documentation/hostapd)

## Connect to a Wi-Fi on wlan1 interface

1. Install `wpa_supplicant` package
    
        pacman -S wpa_supplicant
    
1. Configure `wpa_supplicant.conf`

        wpa_passphrase "<ssid>" "<password>" | tee /etc/wpa_supplicant/wpa_supplicant-wlan1.conf > /dev/null

1. Turn on `wlan1` interface
    
        ip link set dev wlan1 up

1. Initialize `wpa_supplicant`

        wpa_supplicant -B -i wlan1 -c /etc/wpa_supplicant/wpa_supplicant-wlan1.conf

1. Obtain IP Adress

        dhcpcd wlan1

1. Enable `systemd` services for connecting Wi-Fi at boot
  
        systemctl enable wpa_supplicant@wlan1
        systemctl enable dhcpcd@wlan1

1. To customize start up script or look for more details, see: [Wireless Network Configuration](https://wiki.archlinux.org/index.php/Wireless_network_configuration#Custom_startup_scripts.2Fservices) and [WPA Suppliant](https://wiki.archlinux.org/index.php/WPA_supplicant)

