CREATE DATABASE auth_service;

\c auth_service;

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

CREATE TYPE enum_user_status AS ENUM ('available', 'busy', 'away', 'offline');
CREATE TYPE enum_system_status AS ENUM ('login', 'logout');


CREATE TABLE IF NOT EXISTS status_info (
    id SERIAL PRIMARY KEY,
    auth_id INTEGER REFERENCES auth_user(id) NOT NULL UNIQUE,
    client_id VARCHAR(255),
    user_status enum_user_status NOT NULL DEFAULT 'offline',
    system_status enum_system_status NOT NULL DEFAULT 'logout',
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_status ON status_info (user_status);
CREATE INDEX idx_system_status ON status_info (system_status);


CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    chat_members TEXT[],
    roomname VARCHAR(255),
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT member_room_unique UNIQUE(roomname)
);

CREATE DATABASE message_service;

\c message_service;

CREATE TABLE IF NOT EXISTS chat_history (
    id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    has_preview BOOLEAN DEFAULT false,
    preview_content TEXT,
    replayed_by VARCHAR(32),
    replayed_msg_id INTEGER,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_member_id ON chat_history (member_id);
CREATE INDEX idx_sender_id ON chat_history (sender_id);