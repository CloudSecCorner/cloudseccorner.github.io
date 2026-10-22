# Certified Ethical Hacker V12 

### Basic Cybersecurity Concepts

Objectives:

- Define the 5 elements of information security
- Define and differentiate between Red and Blue Teams
- Define Hacking
- Describe the different types of Hackers


+ People watching may be new to cybersecurity. We need to cover foundational
  cybersecurity topics. Can you list the 5 main concepts/elements of cybersecurity
  for us?
  - List the 5 elements of cybersec
+ I've heard of the 'CIA Triad'. Is that what we're talking about here?
  - Define Confidentiality
  - Define Integrity
  - Define Availability
+ How do the other 2 elements fit into the picture?
  - Define Authenticity
  - Define Non-Repudiation

+ Red and Blue Teams
  - Red
  - Blue

+ What is 'hacking'? (v11 1-9-1)
  - General term
  - Term as it's applied to computer security
+ What is a hacker?
  - Threat actor
  - Hobbyist
+ What are the categories that hackers may fall under?
  - White Hat
  - Black Hat
  - Grey Hat
  - Suicide Hacker
  - Script Kiddies
  - Cyber Terrorist
  - State-Sponsored
  - Hacktivist

+ What is an Ethical Hacker and how are they different from malicious Hackers?
  - (v11 1-10-1)
+ This seems like a dangerous skill-set to teach people.
  - Necessary 'evil'
+ Do Ethical Hackers have any limitations or restrictions that malicious
  Hackers don't
  - Scope
    + Systems
    + Times
  - Do no harm
+ Ethical Hacker skillset
  - Technical skills
    + Admin level skills with Operating Systems
    + Admin level networking skills
    + Familiarity with basic security concepts and practices
    + Programming / Scripting
    + Cloud / Containers
    + Mobile devices and IoT
    + ICS / SCADA / OT
  - Non-Technical skills
    + Lifelong learner
    + Tenacious
    + Out-of-the-box thinking
    + Soft Skills (oral/written)
    + Legal knowledge



### Attacker Motives, Goals, and Objectives

Objectives:

- List and define common motives, goals, and objectives of threat actors

+ What motivates a person to commit a cyber attack?
  - Curiosity
  - Bravado
  - Disruption of Business
  - Hacktivism
  - Political
  - Religious reasons
  - Terrorism
  - Revenge
    + Hurt the target's reputation, finances, or both
  - Some form of cyber crime
    + Straight-up theft
    + Blackmail
    + Ransom


### Attack Classifications

Objectives:

- List and define the different attack classifications
- Associate specific attacks types with the attack classifications

+ Can we start off by listing Attack Classifications we'll need to be aware of?
  - Passive Attacks
    public buckets - https://buckets.grayhatwarfare.com
  - Active Attacks
  - Close-In Attacks
  - Insider Attacks
  - Distribution Attacks
+ Let's dig into Passive Attacks
  - Gathering info by inspecting network traffic
    + Clear-text passwords
    + Other sensitive info (in the clear)
    + Difficult/impossible to detect
+ Any Passive Attack examples?
  - Packet Sniffing
  - Network traffic analysis
  - Decryption
+ How about Active Attacks? What are they and how do they differ from Passive?
  - Manipulation of data
  - Disruption of services
  - Breaking into systems and compromising networks
  - Can be detected
+ A few examples of Active Attacks?
  - DoS
  - Password Attacks
  - Session Hijacking
  - Priv Esc
  - SQLi
  - RCE
+ What are we talking about with regards to Close-in Attacks?
  - These attacks are possible through close proximity
    + Being physically near the target could provide opportunity to glean
      actionable intel
  - Could also be through any type of personal contact with target
+ What are some examples of Close-In Attacks?
  - Social engineering
  - Shoulder surfing
  - Dumpster Diving
  - Eavesdropping
+ I've heard that Insider Attacks can be very catastrophic. What do we mean by
  'Insider Attack' and why is it so dangerous?
  - Assumed level of trust
    + Physical access
    + Computer access
    + Attacker is already beyond many/all safeguards
+ Examples of Insider Attacks?
  - Intellectual Property
  - Customer PII
    + Pod Slurping
  - Stolen devices
  - Installing malware and keyloggers
  - Close-in Attacks
    + Social Engineering
  - https://www.k2e.com/articles/insider-threats/
+ Difficult but devastating, we have the Distribution Attack. What's this all
  about?
  + aka Supply-Chain Attack
  + Compromising software and/or hardware before customer installation
+ Examples of Distribution Attacks
  + Solarwinds
    - https://www.sans.org/blog/what-you-need-to-know-about-the-solarwinds-supply-chain-attack/



## Information Warfare 

Objectives:

- Define "Information Warfare"
- List and define IW strategies

+ What is Information Warfare?
  - Attempting to gain a competitive advantage through attacks against target's
    IT systems
+ The term 'Information Warfare' is a bit generic and it breaks down into types
  or categories?
  https://fortiguard.fortinet.com/threat-map
  - C2 Warfare
    + The control over compromised target systems with centralized management
    + The effect or influence they can have on the target
  - Intelligence-based
    + [t]he design and protection of systems that seek sufficient knowledge to
      dominate the battlespace, and the denial of such knowledge to the adversary.
      - https://itlaw.wikia.org/wiki/Intelligence-based_warfare
  - Electronic
    + Interrupting/degrading/stopping the means of electronic communication
      - aka 'Jamming'
  - Psychological
    + Attacking the morale and mental resolve of opponent
      - Attempt to get the opponent to GIVE UP
        + Propaganda
        + Terrorism
  - Hacker
    + 'Soldiers' of Information Warfare
      - Attack target systems (DoS/DDoS)
      - Theft of data and/or systems
      - Disinformation campaigns
  - Economic
    + Interfere with target's economic/financial capabilities
      - Weaken target's economy
        + Theft of IP
        + Reputational Influence
  - Cyberwarfare
    + Similar to Information Warfare in it's definition
      - Includes
        + Information Terrorism
        + Semantic attacks
          - Take over of target system by where the appearance of normal operation
            is maintained
        + Simulated warfare (wargames)
          - 'Sabre Rattling'
          - Open display of weapons acquisition/capabilities
+ What Information Warfare strategies do we need to be aware of?
  - Defensive IW
    + Detection/Prevention
    + Alerts
    + Response
    + Deterrents
    + Emergency Preparedness
  - Offensive IW
    + Web Attacks
    + System hacking
    + MiTM/Replay/Session Hijacking


## Cyber Kill Chain

Objectives:

- List and define the 7 phases of the Cyber Kill Chain
- Identify and explain activities performed at each phase

+ Tell us a little about the development of the cyber kill chain.
  - Developed by Lockheed-Martin around 2011
  - Researchers recognized a common attack pattern
    + Broke that pattern down into 7 phases
      - https://www.lockheedmartin.com/en-us/capabilities/cyber/cyber-kill-chain.html
+ So we have 7 phases, what is the first phase of the cyber kill chain?
  - Recon
    + Information gathering
      - Public info
        + technical and non-technical
+ Phase 2 is Weaponization. Explain that idea.
  - Analyze info gathered in Recon
    + Find possibly exploitable vulnerabilities
      - Create malicious deliverable payload to exploit vulnerabilities
        + Custom malware
        + Off-the-shelf
        + Phishing campaign
+ I'm guessing that once a payload is ready, we're on to Phase 3 Delivery?
  - Correct
  - Payload is delivered to target
    + email
    + usb
    + web
+ How does the Exploitation Phase happen?
  - Clicks on malicious link
  - Goes to compromised web site
  - Executes malicious software binary
+ Our next phase is Phase 5: Installation? What's being installed?
  - 'insider' malware will install more Malware
    + Backdoors
    + Malicious activity hiding
    + Maintaining access
+ It would seem that the Attacker is now ready for the Command and Control phase?
  - Constant communication and control is established
  - Use encryption and other techniques to hide malicious communication
  - Attempt to Priv Esc
  - Continue to hide attacker's presence
+ Phase 7 is called 'Actions and Objectives'. Can you elaborate on that title?
  - Whatever reason the attacker decided to attack can now be done
    + Cyber crime
    + Hacktivism
    + Blackmail
    + Political

## Tactics, Techniques, and Procedures

Objectives:

- Define Tactics, Techniques, and Procedures as they pertain to threat modeling


+ What do we mean when we use the term 'TTP'?
  - The behavior of a threat actor
+ Why are we concerned with the behavior of an attacker?
  - Profiling
  - Threat modeling
+ Explain the concept of Tactics.
  - Tactics are initial objectives
    + I want to gather networking information about my target
    + I want to find out what services my target is running
    + I want to get all the email addresses I can
    + What vulnerabilities does my target have
+ So how does Techniques differ from Tactics?
  - Techniques are the ways I achieve my objective and tools used
    + Perform DNS queries using dig
    + Perform network scans and banner grabbing
    + Scrape the internet for email addresses with the target domain
    + Perform vulnerability scanning against my target
+ Where do Procedures fit into the equation?
  - Advanced action taken to achieve objectives
    + Threat actor profiles users on social media
    + Performs advanced application testing to discover zero-day exploits
    + Does advanced obfuscation techniques in malware payloads


## Threat Modeling

Objectives:

- Define Threat Modeling
- List and describe the 5 steps in the Threat Modeling process

+ I know we've talked a bit about Threat Modeling in other episodes, but can you
  just give us a quick reminder of what Threat Modeling is?
  - A systematized approach to assess the risk/security of an organization
    + Know thy enemy
      - What are the common/most likely attack methods
      - The more detail the better
    + Know thyself
      - Where are we vulnerable

+ What are the steps in the Threat Modeling process?
  1. Identify security objectives
    + What needs to be secured?
    + Any regulatory or policy compliance requirements?
  2. Application overview
    + Identify:
      - Roles
        + Who will be using this?
      - Usage scenarios
        + How will this be used normally?
        + How could this be misused?
      - Technologies
        + OS
        + Supporting Apps and services
        + Network technologies
      - Security mechanisms
        + Authentication
        + Authorization
        + Input validation
        + Encryption
  3. Decompose the application
    + Diagrams help here
      - https://threatdragon.com
      - https://microsoft.com/en-us/download/details.aspx?id=49168
    + Identify
      - Trust boundaries
      - Data flows
      - Entry points
      - Exit points
  4. Identify threats
  5. Identify Vulnerabilities
+ This sounds like a lot of work to develop. Are there any standard models for us
  to use as a guide?
  - STRIDE
    + https://www.eccouncil.org/cybersecurity-exchange/threat-intelligence/what-is-threat-modeling-skills-tools/
  - PASTA (Process for Attack Simulation and Threat Analysis)
    + https://blog.eccouncil.org/what-is-pasta-threat-modeling/
  - DREAD
    + https://www.eccouncil.org/cybersecurity-exchange/threat-intelligence/dread-threat-modeling-intro/


## Cyber threat Intelligence 

