-- Run once after schema.sql in a fresh database.
INSERT INTO Location (address, city) VALUES
('100 Main Street', 'Example City'),
('250 Oak Avenue', 'Example City');

INSERT INTO EmergencyCall (caller_name, caller_phone, emergency_type, description, location_id) VALUES
('Alex Morgan', '202-555-0101', 'Medical', 'Person needs help.', 1),
('Jordan Lee', '202-555-0102', 'Fire', 'Smoke in a building.', 2);

INSERT INTO Incident (call_id, status) VALUES
(1, 'Reported'), (2, 'In Progress');

INSERT INTO ResponseUnit (unit_name, unit_type, status) VALUES
('Ambulance 1', 'Ambulance', 'Available'),
('Fire Truck 1', 'Fire Truck', 'Available');
