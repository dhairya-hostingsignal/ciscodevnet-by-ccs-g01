# ciscodevnet-by-ccs-g01
# Simple Captive Portal System

## Overview

This project implements a simple captive portal system for managing student internet access through a Raspberry Pi access point and a PfSense firewall. The architecture is straightforward, making it easy to understand and maintain.

## Key Components

- **Hardware Setup:**
  - **Main Router:** Provides internet connection.
  - **Laptop:** Runs the PfSense firewall.
  - **Raspberry Pi:** Acts as the access point for students.

- **Network Flow:**
  1. Students connect to the Raspberry Pi WiFi.
  2. Automatic redirect to the captive portal.
  3. Students log in with credentials.
  4. Access is granted or denied based on authentication.
  5. Filtered internet access.

## Basic Folder Structure


```mermaid
graph TB
    subgraph Student["Student Device"]
        browser[Web Browser]
        wifi[WiFi Client]
    end

    subgraph RPi["Raspberry Pi Access Point"]
        direction TB
        hostapd[HostAPD<br/>SSID: School_Network]
        dnsmasq[DNSMASQ<br/>DHCP: 192.168.4.2-254]
        iptables[IPTables Rules<br/>Port 80/443 Redirect]
    end

    subgraph PfSense["PfSense Server (Laptop)"]
        direction TB
        portal[Captive Portal<br/>https://portal.school.local]
        freeRadius[FreeRADIUS Server]
        firewall[Firewall Rules]
        
        subgraph Database["Authentication DB"]
            users[(User Database)]
            policies[(Policy Database)]
        end
    end

    subgraph Internet["Internet Access"]
        web[Filtered Websites]
    end

    %% Connection flow with numbered steps
    wifi -->|"1. Connect to WiFi"| hostapd
    hostapd -->|"2. Association"| dnsmasq
    dnsmasq -->|"3. Assign IP"| wifi
    browser -->|"4. Initial Web Request"| iptables
    iptables -->|"5. Redirect to Portal"| portal
    portal -->|"6. Auth Request"| freeRadius
    freeRadius -->|"7. Verify"| users
    users -->|"8. User Policy"| policies
    policies -->|"9. Apply Rules"| firewall
    firewall -->|"10. Filtered Access"| web

    %% Styles
    classDef student fill:#6366f1,stroke:#6366f1,color:white;
    classDef rpi fill:#047857,stroke:#047857,color:white;
    classDef pfsense fill:#2374ab,stroke:#2374ab,color:white;
    classDef db fill:#db2777,stroke:#db2777,color:white;
    classDef internet fill:#9333ea,stroke:#9333ea,color:white;

    class browser,wifi student;
    class hostapd,dnsmasq,iptables rpi;
    class portal,freeRadius,firewall pfsense;
    class users,policies db;
    class web internet;
