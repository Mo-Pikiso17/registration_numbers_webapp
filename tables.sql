CREATE TABLE towns(townID BIGSERIAL PRIMARY KEY NOT NULL, town_name text NOT NULL, regCode text NOT NULL);


CREATE TABLE registration_numbers(regID BIGSERIAL PRIMARY KEY NOT NULL, regNumber text NOT NULL, parentID INT, FOREIGN KEY(parentID) REFERENCES towns(townID));

INSERT INTO towns(town_name, regCode)VALUES ('Cape Town', 'CA');
INSERT INTO towns(town_name, regCode)VALUES ('Paarl', 'CL');
INSERT INTO towns(town_name, regCode)VALUES ('Stellenbosch', 'CJ');
