-- This file allow to write SQL commands that will be emitted in test and dev.
-- The commands are commented as their support depends of the database
-- insert into myentity (id, field) values(1, 'field-1');
-- insert into myentity (id, field) values(2, 'field-2');
-- insert into myentity (id, field) values(3, 'field-3');
-- alter sequence myentity_seq restart with 4;

INSERT INTO users (username, password, email) VALUES
                                                  ('user1', 'password1', 'user1@example.com'),
                                                  ('user2', 'password2', 'user2@example.com'),
                                                  ('user3', 'password3', 'user3@example.com');
