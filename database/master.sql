-- DROP DATABASE IF EXISTS auth_service;

-- CREATE DATABASE IF NOT EXISTS auth_service;

\c auth_service;

-- DROP TABLE auth_user;

CREATE TABLE IF NOT EXISTS auth_user (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(32) NOT NULL,
    first_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NULL,
    user_password TEXT NOT NULL,
    rh_token TEXT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT auth_user_unique UNIQUE(user_name)
);

CREATE DATABASE message_service;

\c message_service;

CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    chat_members TEXT[],
    roomname VARCHAR(255),
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT member_room_unique UNIQUE(roomname)
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(id),
    message_content TEXT NOT NULL,
    has_preview BOOLEAN DEFAULT false,
    replayed_by VARCHAR(32),
    replayed_msg_id INTEGER,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
