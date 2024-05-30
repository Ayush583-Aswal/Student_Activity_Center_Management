# Student Activity Center Management

## Description

This project is a management system for a Student Activity Center. It allows for efficient organization and management of various student activities.

## Features

- Contains basic homepage themed similar to our college official site. 
- User can explore various activites in our college and can view upcoming/past events, photo gallery of events, rules and regulation for the same  
- only those users whose ID's are their in college MySQL database are allowed to login. No creation of new accounts available
- user can login via student account or worker account.
- only some special students(coordinators of club) can schedule events rest students won't get 'Schedule event' tab
- student can book a room(indicates their presence at that time) of the particular activity and view his booked activites
- student can also view all booked activites of all students. He/She can filter all booked activities on basis of time/date and can accordingly plan their booking time according to the number of people.
- In worker login(either guard/cleaner) can mark their presence of that particular day of duty. 

## Installation and Usage

- Clone the project to local system. Node.js, npm and Mysql are must for project.
- Create databse from  tables.txt and Populatetables.txt(database content of students and workers)
- change the credentials of mysql server in indexjs.js and serv.js
- open terminal inside the project and initialise it using npm: 'npm init'
- install cors,my-sql, other required dependencies. 
- start indexjs.js and serv.js server in different terminals. using: 'node indexjs.js' and 'node serv.js'
- Go to localhost port specified by indexjs.js terminal and you are good to go


## Contribution

- the above project has been contributed by 3 more team members(of IIIT Guwahati) along side me. Namely:
- Aryan Choudhari
- Bibhab DasGupta
- Abhinaba Goshal


## Contact

If you have any questions, feel free to reach out to us at ayushaswal583@gmail.com