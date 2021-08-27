# estiatorio-2021
An individual assessment, the Final Year Project (FYP) which being assigned at the last semester of Degree. The assessment required us to choose a problem statement and implement a system to improve it based on the current given environment. An abundance of documentation such as research papers and surveys needed to be done in order to record down every single element of the system to justify the purpose of the FYP prior the implementation of the system, and it is a complex task that required careful tendering. In this FYP I have chose to do a website that is focused on improvising the restaurant reservation system with table management feature, such as having the system to be able to automatically optimized the seating of the restaurant accordingly to maximizing the potential revenue of the restaurant within the hourly calculation. System implementation was being done by using the newfound knowledge such as ReactJS, Node, Axious, along with the PHP knowledge in handling the functionalities and finally, the MaterialUI as the core design implementation on the said system.

**DISCLAIMER: The uploaded project file is only for references and comparison, the project file will not be used in any profit-oriented activities without my permission. The user that downloaded the said project will be responsible for any outcomes of their future implementation on the project, and I will not held any legal responsibilities upon your action. However, any users are welcomed to suggest any changes or improvements upon the project if they want to.**

**===================================INSTRUCTIONS===================================**
1. Import Database into WAMP's phpMyAdmin. (File name: ```estiatorio.sql```)
2. Go to SQL tab in phpMyAdmin and type this (before that enable event scheduler, type in SQL tab with this: ```SET GLOBAL event_scheduler="ON"; ```):

```
CREATE DEFINER=`root`@`localhost` EVENT `auto_cancellation` ON SCHEDULE EVERY 1 SECOND STARTS '2021-07-16 05:01:01' ON COMPLETION NOT PRESERVE ENABLE DO UPDATE reservation_log SET status = 2 WHERE reservation_log.reservation_time < NOW() AND reservation_log.status = 1
```
3. Pull the file, then finally run it with ```npm run start``` within the console in Visual Studio Code.

**===================================INSTRUCTIONS===================================**
