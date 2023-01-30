
SET GLOBAL time_zone='Asia/Seoul';

CREATE DATABASE IF NOT EXISTS commerce;

grant all privileges on *.* to `commerce`@`%`;

create table commerce.users
(
    id         bigint auto_increment
        primary key,
    email      varchar(255)                             not null,
    password   varchar(2048)                            not null,
    birth      date                                     null,
    created_at datetime(6) default CURRENT_TIMESTAMP(6) not null,
    is_admin   tinyint(1)  default 0                    not null
);

insert into commerce.users (email, password, is_admin)
values ('admin@test.com', '$2b$12$UEUo.7ThHaF7tHH61EFAkOIbQLxtsBEj7/k4fL9aeeRDgfIGxBo.C', true);
