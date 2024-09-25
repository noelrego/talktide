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