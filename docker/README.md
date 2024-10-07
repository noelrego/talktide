## Application Setup process.

### Pre requisite
- Docker installed on your system ( v.4 and above )
- Git installed

### Follow the docker instruction

1. First create a folder called `PROJECT`
2. Clone the repository inside this folder.

    ```
    $ git clone https://github.com/noelrego/talktide.git
    ```

3. Navigate inside the folder `talktide` and change the branch to `dev`.

    ```
    $ git fetch --all
    $ git checkout dev
    ```

4. Navigate inside `docker` directory. We need some env variables. Rename the `sample.env` file to `.env`.

    ```
    $ mv sample.env .env
    ```
    `NOTE` '''Replace the `sample.env` file which is shared seperately over the Email'''
4. Bring up the Database service and create Table relations. Build the Database service. From the directory `talktide/docker` and run the follwing commands.
    ```
    $ docker-compose build talktide-db && docker-compose up -d talktide-db
    $ ../database/master.sql | docker exec -i chat-db -U admin
    ```
    this should create database schema required for the application.
5. Now build all the remaining services and bring up the application.
    ```
    $ docker-compose build
    $ docker-compose up -d
    ```

### Application Acess
Once the docker build is complete the application starts with above command.
Navigate to [http://localhost:4200/](http://localhost:4200/register).

[RabbitMQ](http://localhost:15672/) user `guest` as credentials.

