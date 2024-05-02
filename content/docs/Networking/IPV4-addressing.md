### Understanding IPV4 addressing scheme 

### Understanding IPv4 

- Length - 32 bits in the form of Binary Notation 
- Decimal - 192.168.1.2 
- Binary - 110000.1110000. ..
- Octet - a group of 8 bits 

### Public IPv4 address 

- there are two (2) main IPV4 address space are the public address space and the private address space 

- The Primary difference between both address spaces is the public IPV4 addresses are routable on the Internet 

- any device which requires communication other devices on the internet will need to be assigned a public IPv4 address on its interface which is connected to the internet 


| class | Range  | 
|------------|------------|
| class A  | 1.0.0.0 - 126.255.255.255 | 
| Class B | 128.0.0.0 - 191.255.255.255 |  
| Class C | 192.0.0.0 - 223.255.255.255 |
| Class D (Multicast)| 224.0.0.0 - 239.225.255.255 | 
| Class E (Experimental) | 240.0.0.0 - 255.255.255.255 | 


### Private IPv4 Address 

- There are three 3 classes of private IPv4 address which are allocated for private use only this means 
within private network such as a local area network (LAN)

- The benefit of using the private address space (RFC 1918 ) , the classes are not unique to any particular orgnization or group 

- they can be used within an organization or a private network however on the internet the public IPv4 address is unique to device 

| class | Range  | 
|------------|------------|
| class A  | 10.0.0.0 - 10.255.255.255 | 
| Class B | 172.16.0.0 - 172.31.255.255 |  
| Class C | 192.168.0.0 - 192.168.255.255 |


### Subnet Mask

- For every IP address there's an accompanying subnet mask. this address is used to define the following 

    - the subnet mask is used to indicate the network and host portion of an IP address 

    - The subnet mask is used to determine the number of available IP addresses on a network 

    - if two(2) or more devices such as computers are communicating over multiple networks the subnet mask of each device determines if a computer should send the packet to the default gateway/router or not 

| class | Range  | 
|------------|------------|
| class A  | 255.0.0.0 | 
| Class B | 255.255.0.0 |  
| Class C | 255.255.255.0 |


- each IPV4 address class has their own default subnet mask 

- an IP address such as 10.10.10.1 which is a private class A address , will use the subnet mask of 255.0.0.0 

- another example we can use is the address , 191.5.4.6 which is a public class B address thetefore thus address will use default subnet mask of 255.255.0.0 


### Types of IPV4 addresses 

- Loopback 
  - more commanoly identified as only 127.0.0.1 these are special address used by a host to direct traffic to itself 
  - Ranges from 127.0.0.1 to 127.255.255.254 

- Link-Local 
   - More commonly known as the automatic private IP addressing (APIPA) addessed they are used by winodows DHCP client to self-configure in the event that there are no DHCP severs available 
   - Range from 169.254.0.1 to 169.254.255.254 

- TEST-NET
    - these addresses are set aside for teaching and learning purposes and can be used in documentation and network examples 
    - Ranges from 192.0.2.0 to 192.0.2.255 

- 

  
