#### Exploring IPv6 addressing 


### what is IPV6?

- like IPv4 this new address has a fromat of it own 
- as you can recall an IPv4 address consist of 32 bits in length and can we written in deciaml notation for understanding 
- an IPv6 address consist of 128 bits in length and is written in hexadecimal notation 
- with 128 bits this allows IPv6 to scale to approximately 1 undecillion addresses 
- An IPv6 address is made up of eight(8) hextets , each comprises of 16 bits and this means 8 X 16 = 128 bits in length 
- Since Hexadedimal numbers are 0 1 2 3 4 5 6 7 8 9 A B C D E F (0 - f) each hextet ranges from 0000 - FFFF 
- Lets atke a look at few IPv6 addresses - 2001:0DB8:0000:1111:0000:0000:0000:0200 

### Type of IPv6 addresses 

- Global Unicast 
   - In IPv4 , we called an internet assigned address a public address 
   - In IPv6 , we have a public address as well , however its known as a Global Unicast address , 2000::/3 

- Link-local 
   -   An IPv6 link local address are in FE80::/10 network block 
   -   the link local address is used for local network communication only 
   - this means there are two (2) IPv6 addresses on an interface 1 global unicast address for comminicatioon with devices within a local network 

- Loopback 
   - the link local  address haas the same funcationality aas the link local address in the IPv4 address space 

   - However in the IPv6 space the link local address ::1/128 
   - this means only the fisrt bits is 1 in the entire address 
   - unlike IPv4 the IPv6 link local address is a single address 

- Unique local 

   - this type of address has the similarity of a private address IPv4 address and is really limited to your network FC00::/7 

- Anycast 
    - This type of address is shared between multiple devices , however the transmission of a message is sent to the closet device based on geographic location 

- Multicast 
   - This address is used by a group devices 
       - Aaassigned   - FF0s::/8 
       - Solicited Node - FF02::1:FF00:0000/104 
         