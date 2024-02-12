create table user_(
    id int primary key AUTO_INCREMENT,
    name varchar(250),
    contactNumber varchar(20),
    email varchar(50),
    password varchar(250),
    status varchar(20),
    role varchar(20),
    UNIQUE (email)
);

insrt into user_(name,contactNumber,email,password,status,role) values('Admin','111-222-3333','admin@gmail.com','admin','true','admin')