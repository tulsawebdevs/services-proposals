CREATE OR REPLACE FUNCTION trigger_set_updated() RETURNS TRIGGER AS $$
BEGIN
	NEW.updated = NOW();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

/*
SETUP PROPOSALS TABLE
*/
CREATE TABLE if NOT EXISTS proposals (
	title varchar(100) NOT NULL,
	summary TEXT NOT NULL,
	description TEXT NOT NULL,
	type varchar(32) NOT NULL,
	status varchar(32) DEFAULT 'draft' NOT NULL,
	id SERIAL PRIMARY KEY,
	created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated TIMESTAMP
);

CREATE OR REPLACE TRIGGER set_updated
BEFORE UPDATE ON proposals
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated();

/*
SETUP VOTING TABLE
*/

CREATE TABLE if NOT EXISTS votes (
	voter_email TEXT NOT NULL,
	proposal_id INT NOT NULL REFERENCES proposals(id),
	vote INT NOT NULL,
	created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated TIMESTAMP,
	id SERIAL PRIMARY KEY
);

CREATE OR REPLACE TRIGGER set_updated
BEFORE UPDATE ON votes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated();

/*
SETUP DRAFTS TABLE
*/
CREATE TABLE if NOT EXISTS drafts (
     title varchar(100) DEFAULT '' NOT NULL,
     summary TEXT DEFAULT '' NOT NULL,
     description TEXT DEFAULT '' NOT NULL,
     type varchar(32) DEFAULT '' NOT NULL,
     id SERIAL PRIMARY KEY,
     created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
     updated TIMESTAMP
);

CREATE OR REPLACE TRIGGER set_updated
BEFORE UPDATE ON drafts
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated();
