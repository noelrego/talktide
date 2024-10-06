# TALK TIDE - Chat Application

### Intoduction 
Talk Tide is a chat application user can register to the application and interact with the available users with real time. 

### Available Features

1. User Authentication with Username and Password.
2. See all the available users.
3. One to one live chat.
4. Update user status real time.
5. Replay message

### Additional features
1. Create chat history.
2. Notification of new message.
3. Check for username availablity while registering to the system.

## System components

The application architecture uses API Gatewat and Datbase per service micro service architecture. Where events are exchanges through RabbitMQ.

| #  |  Core components | Purpose                       |  Port   |
|----|------------------|-------------------------------|---------|
| 1  | Angular | To provide the user inteface build with Bulma and State management, and Socket io clinet to real time communication  | 4200 |
| 2  | API gateway | Backend Http server built by Nest.js to authenticate and route the trafic between micro services| 8080 |
| 3 | Socket Server | A web socket server by Nest.js to handle Authentication and real time commnunication| 8082 |
| 4 | RabbitMQ | A Message broker to transport the events between Micro Service | 5672 |
| 5 | Postgres | Relational databse to store the Application data | 5432 |
|6 | Auth User Service | A Micro service to manage User Data and relation between paricipients. Which has It's own database to manage. | |
| 7 | Message Service | To manage user chat history. Which has it's own database | |
| 8 | Docker | To build and run the application| |

## Application Installation Steps

Follow this guide to setup the application locally.
[TalkTide Local Hosting process](./docker/README.md)
