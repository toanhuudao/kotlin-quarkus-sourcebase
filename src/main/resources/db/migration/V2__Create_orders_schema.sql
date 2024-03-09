CREATE TABLE Orders
(
    id            bigint NOT NULL,
    customer_name varchar(255),
    product_name  varchar(255),
    quantity      integer,
    PRIMARY KEY (id)
);

CREATE SEQUENCE Orders_SEQ START WITH 1 INCREMENT BY 50;
