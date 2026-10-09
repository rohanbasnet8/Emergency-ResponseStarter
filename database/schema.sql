-- Beginning tables for the class project. Run once in an empty database.
CREATE TABLE Location (
    location_id SERIAL PRIMARY KEY,
    address VARCHAR(255),
    city VARCHAR(100)
);

CREATE TABLE EmergencyCall (
    call_id SERIAL PRIMARY KEY,
    caller_name VARCHAR(100),
    caller_phone VARCHAR(30),
    emergency_type VARCHAR(30),
    description TEXT,
    location_id INTEGER REFERENCES Location(location_id)
);

CREATE TABLE Incident (
    incident_id SERIAL PRIMARY KEY,
    call_id INTEGER REFERENCES EmergencyCall(call_id),
    status VARCHAR(30) DEFAULT 'Reported'
);

CREATE TABLE ResponseUnit (
    unit_id SERIAL PRIMARY KEY,
    unit_name VARCHAR(100),
    unit_type VARCHAR(30),
    status VARCHAR(30) DEFAULT 'Available'
);
