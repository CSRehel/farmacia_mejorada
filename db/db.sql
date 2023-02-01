drop table if exists reserves;
drop table if exists prescriptions;
drop table if exists discarded;
drop table if exists stock;
drop table if exists users;

create table users(
    id serial primary key,
    email varchar(50) not null unique,
    password varchar(100) not null,
    token varchar(255)
);

create table stock(
    id serial primary key,
    medicine varchar(50) not null,
    code int not null,
    description varchar(300) not null,
    manufacturer varchar(50) not null,
    weight int not null,
    measure varchar(5) not null,
    unit int not null,
    box int not null,
    total int not null check (total > -1),
    id_user int not null,
    foreign key(id_user) references users(id)
);

create table discarded(
    id serial primary key,
    reason varchar(100) not null,
    amount int not null,
    id_stock int not null,
    foreign key(id_stock) references stock(id)
);

-- state: pendiente | reservado | entregado | descartado
create table prescriptions(
    id serial primary key,
    id_prescription int not null unique,
    rut varchar(10) not null,
    email varchar(50) not null,
    patient varchar(100) not null,
    medicine varchar(50) not null,
    weight_medicine int not null,
    measure_medicine varchar(5) not null,
    amount int not null,
    days int not null,
    state varchar(20) not null,
    id_stock int not null,
    foreign key(id_stock) references stock(id)
);

-- reserve_option: notification/no_reserve
create table reserves(
    id serial primary key,
    reserve_option varchar(12) not null,
    id_prescription int not null,
    foreign key(id_prescription) references prescriptions(id)
);


select p.id, p.patient, p.email, p.medicine, p.weight_medicine, p.measure_medicine, p.amount, r.reserve_option
from prescriptions as p join reserves as r
on p.id = r.id_prescription
where p.medicine = 'diclofenaco sodico' and r.reserve_option = 'notification';