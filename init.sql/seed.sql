
DROP TABLE IF EXISTS message_queue;
DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS conversation;

SET TIME ZONE 'UTC';

-- enums

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_type') THEN
        CREATE TYPE message_type AS ENUM ('sms', 'mms', 'email');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'send_status') THEN
        CREATE TYPE send_status AS ENUM ('P', 'E', 'D');
    END IF;
END
$$;


CREATE TABLE conversation (
    conversation_id SERIAL PRIMARY KEY, 
    participant_1 VARCHAR(255) NOT NULL,
    participant_2 VARCHAR(255) NOT NULL
);


CREATE TABLE message (
    message_id SERIAL PRIMARY KEY,
    sent_by VARCHAR(255) NOT NULL, 
    received_by VARCHAR(255) NOT NULL, 
    type message_type NOT NULL, 
    body TEXT NOT NULL, 
    attachments TEXT[], 
    timestamp TIMESTAMPTZ NOT NULL,
    conversation_id INT NOT NULL REFERENCES conversation(conversation_id),
    messaging_provider_id varchar(255)
);


CREATE TABLE message_queue (
    message_queue_id SERIAL PRIMARY KEY,
    message_id INT NOT NULL REFERENCES message(message_id),
    status send_status NOT NULL, 
    created_at TIMESTAMPTZ,
    updated_at timestamptz
);


