CREATE TABLE users
(
    id         BIGSERIAL NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    email      VARCHAR(255),
    password   VARCHAR(255),
    username   VARCHAR(255),
    PRIMARY KEY (id),
    UNIQUE (email),
    UNIQUE (username)
);
