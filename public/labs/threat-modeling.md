## What is Threat Modeling ? 

Threat modelinh is structured approach used to identify , access and address potential security threats to a system application or network . Adam Shostack , a key figure in developement of threat modeling at Microsoft defines it as 
"the use of abstractions to aid in thinking about risks  " while its a broad term that entails many optional components , broadly it concerns the following key objectives 

1. Identify assets - Determine what valuable assets need protection . these could include sensitive data , intellectual property , user credentials , system availability , etc 

2. Identify Threats - Understand the different types of threats that could target these assets , Threats might come from 
external attackers , malicious insiders or even enviromental factors like natural disasters 

3. Identify Vulnerabilities - Assess the system's design and architecture to uncover weaknesses that could be exploited 
this includes software bugs , cofiguration errors and design flaws 

4. Define Security Controls - Establish measures that can mitigate identifies threats and vulnerabilities . These could include encryption , access controls , monitoring systems and more 

5. Documeents and Review - Keep though documentation of the threat model and review it regularly as System evolbe and new threats emerge , threat models need to be updated 

### When Do we Conduct Threat Modeling ?

Threat Modeling should ideally start befote any code is written to reduce the complexity of decisions throughout the SDLC
it helps transition from reactive to proactive security , enabling the design of securit measures from outset . However , 
Threat Modeling should be ongoing , integrated throughout the SDLC to ensure continuous to evolving threats  

### Why Do we Threat Model ?

For Security of course but here's deeper dive: Skipping or minimizing threat modeling after the initail design or once 
minimum viable product (MVP) is ready might seem tempting . it can feel like extra work to maintain both an abstract model
alongside the actual application . However , threat modeling provides qualitative insights that help serive quantitaive security measures . Building digital applications and ecosystems is alredy complex - simplifying them through abstraction even if it means extra work upfront , enables you to test idea sooner and build more efficiently . you don't want to get 
caught with your pants down , so best to anticipate how they might fall . Threat of gravity ? lets bake a belt of suspenders into our product 

some key advantages are : 

- cost efficiency : Early identification of threats allows for more cost-effective mitigation . fixing vulnerability during the design phase is often far less ecpensive than addressing it after deployement 

- compliance and standards - many regulatory frameworks and security standards ( eg. PCI-DSS , GDPR) require some form of 
risk assessment and management Threat Modeling helps meet these requirements 

- Improved Communication - It provides a structurd way to commuicate about security risks among various stakholders , including developrs , security teams , management and clients 

Threat Modeling is good go it? Okat lets talk process . 


## The Threat Modeling Process 
every good process needs a guiding philosophy and in threat modeling , this is philosophy is captured in the [Threat Modeling Manifesto](https://www.threatmodelingmanifesto.org) . Its not a step by stemo guide or specific methology ; it's a set of principles that help guide your process  . its main feature is the four Questions framework , which describes the 
four essential inquiries for creating threat model in any context: 

1. what is we working on ? (identification ) - Define your objectives , identify assets and describe (or model) your system 

2. What can go wrong? ( Analysis ) - Identify and analyze threats to your system and calculate the risks they pose 

3. What are we going to do about it ( Review ) - Test Changes , update your threat model and ceate or revise documentatin as necessary 

Notice the use "we" here? Threat Modeling is a collabrative effort not a solo endeavor . it requires diverse skills and expertise from multipe teams to ensure a comprehensice system model and unified developement direction there are no security hero 

some key participants include : 

- Security team : They've got the eyes for threats . This way be members of the defensive squad ( like you ) or members of the offensive security squad ( who prentend to be attackers so you can better anticipate the real attackers )

- Developement Team : They've the ones building the application 

- Infrastructure team : They've helped deploy the application , and their deep system and networking knowledge is crucial 

- Governance , Risk and Compliance (GRC) team - They ensure alignment with organization risk management Objective and Compliance requirements 

- Stakeholders - They help align your model with the strategic goals of the organization 

-  End-Users - While not directly involved , their insights can provide valuable input 


### Threat Modeling Diagrams 

Remember the quote -" Threat Modeling is the use of abstractions to aid in thinking about risks?" well there are common way to represent these abstractions in threat modeling , while you could scribble or pros/cons list on a napkin or create 
an elabtaye corkboard with twine and thumbtacks , using well-known diagrams can help streamline the process and make it more accessible to all parties involved . here are two common diagram types :


- Data Flow - Diagram (DFD) - Shows the flow of data between components of a system . its usually the starting points for a threat model diagarm , typically performed in the identification phase (answering) "what are we working on?" DFDs can be 
represnted at varying levels of details (eg DFD level 0, level 1 , level 2, level 3 ) with different elevels revealing diffent threats 

- Attack Tree (AT) - A diagram showing the various ways a threat actor might achieve a specific goal or how a system may be attacked . these are decision trees where the root node represents the attacker's goal and the leabes show how they 
achieve the goal . Attack trees are typically inverted - you start at the leaves (the potentail attack paths) and work up 
to the root node (the goal)

### Threat Modeling metholodolgies , Libraries and Tools 

there isn't one "right" way to model systems or describe threats nor any "right" tool or methodology . We're gathering data  , turning it into information and then into actionable intelligence . How best to do that will vary across teams and 
products with that disclaimer , hete are some popular methodologies , libraries and tools used in threat modeling . 


## methodogies 

these are structured approaches used to systemtically identify , categorize and address potentail security threats with a system or application 

Microsoft Threat Modeling - Originating from Microsoft this method involves fiv steps 

1. Define the security requirements 
2. Diagram the application 
3. Identify Threats 
4. Mitigate threats 
5. validate that threats have been mitigated 

PASTA (Procsess for Attack simulation and threat analysis ) - A risk-centric approach aligning business objectives and technical requirements . it involves seven steps 

1. Define security objectives 
2. Define Technical scope 
3. Decompose application (DFD)
4. Analyze threats 
5. Analyze Vulnerabilities 
6. Attack Analysis (AT)
7. Risk/Triage assessment 

here is how these methodologies map to the Threat Modeling Manifesto's Four-Question Frameworks 


| 4Q | PASTA | Microsoft's 5-Step Threat Modeling |
|---|---|---|
| What are we working on? | 1. Define the objectives<br>2. Define the technical scope<br>3. Application decomposition (DFD) | 1. Define security requirements<br>2. Diagram the application (DFD) |
| What can go wrong? | 4. Threat Analysis<br>5. Vulnerability and weakness analysis<br>6. Attack modeling (AT) | 3. Identify threats |
| What are we going to do about it? | 7. Risk and Impact Analysis | 4. Mitigate Threats |
| Did we do a good enough job? | | 5. Validate threats have been mitigated |

## attack library 

these are predefined collections of attack pattherns and tactics that provide a structured way to think about potential threat and adversary behaviour 

STRIDE - Another Microsoft Invention . used to answer the question "what can go wrong in this systemm we're working on ?"
and premised on the idea that softwaee comes under a predicatble set of threats that can be encapsulated by 6 categoris . Not a particularly good taxonomy for enumerating attacks (especially compared to the next on ) but very common and helps 
simplify security conversations consists of 

1. Spoofing - refers to an attacker pretending to be someone or something else typically to gain unauthorized access for 
example using stolen credentials to impersonate another user or system 

2. Tampering - involves modifying data , either in transit or at rest , without authorization this can include altering 
configuration files , database records , or data sent between systems 

3. Repudiation - Occurs when an attacker can deny their actions because the system lacks proper logging or tracking mecahnisems . this makes it difficult to trace and prove an attcker's activities withing the system 

4. Information Disclosure - Occurs when confidential or sensitive d ata is exposed to unauthorized individualls. this can include laeaking private information , intellectual property or personally identifiable information (PII)

5. Denial of service - aims to make a system or service unavailable by overwhelming it with requests or causing system malfunctions . this disrupts normal operations and prevents legitimate users from accessing the system 

6. Elevation of Privilege - Occurs when an attacker agains unauthorized access to higher [vertical](https://en.wikipedia.org/wiki/Privilege_escalation#Vertical) or [horizontal](https://en.wikipedia.org/wiki/Privilege_escalation#Horizontal) level of privilege within a system 


MITRE ATT&CK - 