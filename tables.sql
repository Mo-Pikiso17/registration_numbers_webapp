CREATE TABLE towns(townID BIGSERIAL PRIMARY KEY NOT NULL, town_name text NOT NULL, regCode text NOT NULL);


CREATE TABLE registration_numbers(regID BIGSERIAL PRIMARY KEY NOT NULL, regNumber text NOT NULL, parentID INT, FOREIGN KEY(parentID) REFERENCES towns(townID));