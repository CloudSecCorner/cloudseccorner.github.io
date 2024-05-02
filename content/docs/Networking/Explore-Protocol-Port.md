

### SSH ( Secure Shell)

- Sceure she;; (SSH) is a secure network protocol which provide data encryption 

- SSH allows a user to securly access a remote system acrsoss a network 

- SSH uses port 22 by default 

#### Telnet 

- telnet is an unsecure network protocol which does not provide any data encryption features 

- telnet allows a user to access a remote system across a network but the connection is not secure 

- Telnet uses port 23 by default 

### Domain Name System (DNS)

- Domain name system (DNS) is a network protool which is used to resolve a hostname to an IP addresses 

- DNS operates on port 53 by default 

- Since everything on network has an IP address it can be difficult to remember the IP address of every device on a network 

-  Hostnames are assigned to systems and devices which makes it easier for us to remember 

- A DNS Server is a server which contains various recordes about hostnames to IP address mapping 


![](/img/DNS.png)

#### File Transfer Protocol (FTP) 

- FTP is a network protocol allows file transfer between an FTP client and an FTP Server 

- FTP does not provide data encryption it sends data in plaintext 

- FTP uses port 20 for data transfers 

- FTP uses port 21 for control (commands ) from the client to server 

![](./images/FTP.png)

### SSH FTP (SFTP)

- SFTP establishes an SSH session between the FTP client and the FTP server across the network 

- SFTP allows all the FTP messages to be sent across SSH Tunnel between devices 

- SFTP uses port 22 by default 


### FTP SSL ( FTPS) 

- FTPs uses secure sockets layer (SSL) to encryt the FTP messages as they are exchanged between the FTP client and the FTP server 


### Trivial FTP ( TFTP )

- TFTP is a network protocol is a very light version of FTP which operates on port 69 

- TFTP is commonly used quickly upload and download files betwwen a client and a network devices 

- Networl Professionals Commonly used TFTP to Transfer the firmware to a network device to perform upgrades 

### Email Protocols 

- Simple Mail Transfer Protocol (SMTP) - Sends outbound email messages and uses port 25 by default 

- Post Office Protocol 3 ( POP 3) - used to download email messages from an email server over port 110 

- Internet Message access protocol 4 ( IMAP4) - used to synchronized emails between the client and server over port 143 

![](./img/email-proto.png)

### DHCP 

- Dynamic Host Configuration Protocol (DHCP) is a nwtwork protocol which allows a DHCP server to automatically distribute IP Address to client system on a  network .

- A DHCP client send DHCP message with a source port 68

- A DHCP server uses port 67 by default 

![](./img/DHCP.png)
DORA 

### HTTP and HTTPS 

- Hybertext Tansfer Protocol ( HTTP ) is an unsecure protcol which allows a web browser to communicate with a web server 

- web severs uses port 80 by default 

- HTTP over SSL ( HTTPS) allows a web browser to establish a secure connection to a web server 


- the connection can use either secure sockets layer (SSL) or Transport Layer Security ( TLS)

- HTTPS uses port 443 by default 


### SNMP 

- Simple Network Management protocol ( SNMP ) is network protocol which is used to manage network devices 

- SNMP is able to gather informaton about devices on a network devices 

- SNMP is able to perform network monitoring and apply device configurations 

- SNMP has 3 components : Manager , Agent and Management Information Based ( MIB)

3 version of SNMP 

- SNMPv1 - Has bad security features 
- SNMPv2 - Has nad security features 
- SNMPv3 - Supports encryption and authentication 
- SNMP uses port 161 

![](./img/SNMP.png)


### Network Time Protocl (NTP) 

- Network Time Protocol (NTP) is used to sync time on a network 
- NTP is unsecure by default , allowing attackers to exploit its vulnerabilities 
- NTP operates on port 123 

![](./img/NTP.png)

### Remote Deskstop Protocol (RDP)

- RDP is a remore access network protcol which is designed for microsoft windows 
- RDP operates on port 3389 

###  Lightweight Directory Access Protocal (LDAP) 

- Lightweight Directory Access Protocol (LDAP) is used to perform read , write and query a directory server over a network 

- LDAP operates on port 389 

- Uses the X.500 standard defines how information is stored on a directory 

- LDAP is not secure by default and send unencryted data across a network 

- LDAPS ( LDAP secure) uses SSL to provide data encryption 

- LDAPs operates  on port 636 

### Sever Message Block (SMB)

- SMB is a network protocol which is used on Microsoft Windows environment for file shares services 

- SMB operates on port 137(UDP) , 138(UDP) and 443 (TCP)

