-- Initial seed data for BITS Hackathon Hub

-- Insert an Admin
INSERT INTO users (username, email, password, full_name, role) 
VALUES ('admin', 'admin@bits.edu', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7u41W3u', 'System Admin', 'ADMIN');

-- Insert a sample Hackathon
INSERT INTO hackathons (title, description, start_date, end_date, registration_deadline, max_participants, status, is_online)
VALUES ('BITS Summer Hack 2024', 'Annual summer hackathon for all BITSians', '2024-06-01 09:00:00', '2024-06-03 18:00:00', '2024-05-25 23:59:59', 500, 'OPEN', TRUE);
