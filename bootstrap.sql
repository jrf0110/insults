create table insults (
  id            serial primary key
, message       text
, "createdAt"   timestamp without time zone default now()
);