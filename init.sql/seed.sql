drop table if exists message_type;
drop table if exists conversation;
drop table if exists message_queue;

SET TIME ZONE 'UTC';

create type message_type as ENUM ('sms', 'mms', 'email')
-- pending, errored, delivered
create type send_status as ENUM ('P', 'E', 'D')
create table message (
    message_id serial primary key,
    from varchar (255) not null, 
    to varchar(255) not null, 
    type message_type not null, 
    -- avoid malfeasance  ? 
    body text not null, 
    attachments text[], 
    timestamp timestamptz not null
    conversation_id foreign key references(converstaions.conversation_id) not null

)

create table conversation(
    conversation_id serial primary key, 
    -- created as strings  
    participants TEXT[]


)

create table message_queue(

message_id foreign key references message.message_id not null, 
status send_status not null, 





)

