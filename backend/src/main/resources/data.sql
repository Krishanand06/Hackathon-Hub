-- Seed data for the current BITS Hackathon Hub website.
-- Local demo password for every seeded user is 123456.

INSERT IGNORE INTO users (user_id, username, email, password_hash, full_name, role, bio, github_url, avatar_url) VALUES
(1, 'admin', 'admin@bits.edu', '123456', 'System Admin', 'ADMIN', 'Platform administrator', NULL, NULL),
(2, 'demo_user', 'demo@bits.edu', '123456', 'Demo Student', 'STUDENT', 'BITS Pilani CS student', 'https://github.com/demo', NULL),
(3, 'judge_isha', 'judge@bits.edu', '123456', 'Isha Nair', 'JUDGE', 'Hackathon judge and product mentor', NULL, NULL),
(101, 'arjun_k', 'arjun@bits.edu', '123456', 'Arjun Kumar', 'STUDENT', 'Full stack developer', NULL, NULL),
(102, 'priya_s', 'priya@bits.edu', '123456', 'Priya Sharma', 'STUDENT', 'ML engineer', NULL, NULL),
(103, 'rahul_m', 'rahul@bits.edu', '123456', 'Rahul Mehta', 'STUDENT', 'Backend developer', NULL, NULL),
(104, 'anita_p', 'anita@bits.edu', '123456', 'Anita Patel', 'STUDENT', 'Blockchain developer', NULL, NULL),
(105, 'vikram_r', 'vikram@bits.edu', '123456', 'Vikram Rao', 'STUDENT', 'ML developer', NULL, NULL),
(106, 'sanya_g', 'sanya@bits.edu', '123456', 'Sanya Gupta', 'STUDENT', 'AI and mobile developer', NULL, NULL),
(107, 'ravi_k', 'ravi.student@bits.edu', '123456', 'Ravi Krishnan', 'STUDENT', 'Backend and DevOps developer', NULL, NULL),
(108, 'meera_s', 'meera@bits.edu', '123456', 'Meera Singh', 'STUDENT', 'UI and UX designer', NULL, NULL),
(109, 'karan_v', 'karan@bits.edu', '123456', 'Karan Verma', 'STUDENT', 'Computer vision specialist', NULL, NULL),
(201, 'dr_ravi', 'mentor@bits.edu', '123456', 'Dr. Ravi Shankar', 'MENTOR', 'Senior Research Scientist at Google DeepMind. 10+ years in ML research.', NULL, NULL),
(202, 'priyanka_m', 'priyanka@stripe.com', '123456', 'Priyanka Mehta', 'MENTOR', 'Engineering Manager at Stripe. Built payment infrastructure used by millions.', NULL, NULL),
(203, 'arun_i', 'arun@microsoft.com', '123456', 'Arun Iyer', 'MENTOR', 'Principal Cloud Architect at Microsoft Azure.', NULL, NULL);

INSERT IGNORE INTO skills (skill_id, skill_name, category) VALUES
(1, 'React', 'FRONTEND'),
(2, 'Node.js', 'BACKEND'),
(3, 'Python', 'BACKEND'),
(4, 'Machine Learning', 'AI_ML'),
(5, 'TensorFlow', 'AI_ML'),
(6, 'Java', 'BACKEND'),
(7, 'Spring Boot', 'BACKEND'),
(8, 'SQL', 'DATABASE'),
(9, 'UI/UX', 'DESIGN'),
(10, 'Figma', 'DESIGN'),
(11, 'Blockchain', 'BLOCKCHAIN'),
(12, 'Solidity', 'BLOCKCHAIN'),
(13, 'Docker', 'CLOUD'),
(14, 'Kubernetes', 'CLOUD'),
(15, 'AWS', 'CLOUD'),
(16, 'Computer Vision', 'AI_ML'),
(17, 'FinTech', 'PRODUCT'),
(18, 'APIs', 'BACKEND'),
(19, 'Cybersecurity', 'CYBERSECURITY'),
(20, 'IoT', 'OTHER');

INSERT IGNORE INTO user_skills (user_id, skill_id, proficiency_level) VALUES
(2, 1, 'INTERMEDIATE'), (2, 2, 'INTERMEDIATE'), (2, 3, 'INTERMEDIATE'),
(101, 1, 'ADVANCED'), (101, 2, 'ADVANCED'), (101, 3, 'INTERMEDIATE'),
(102, 4, 'ADVANCED'), (102, 3, 'ADVANCED'), (102, 5, 'INTERMEDIATE'),
(103, 6, 'ADVANCED'), (103, 7, 'ADVANCED'), (103, 8, 'ADVANCED'),
(104, 11, 'ADVANCED'), (104, 12, 'ADVANCED'), (104, 1, 'INTERMEDIATE'),
(105, 4, 'ADVANCED'), (105, 3, 'ADVANCED'),
(106, 3, 'ADVANCED'), (106, 4, 'ADVANCED'), (106, 16, 'INTERMEDIATE'),
(107, 2, 'ADVANCED'), (107, 13, 'INTERMEDIATE'),
(108, 9, 'ADVANCED'), (108, 10, 'ADVANCED'), (108, 1, 'INTERMEDIATE'),
(109, 16, 'ADVANCED'), (109, 3, 'ADVANCED');

INSERT IGNORE INTO hackathons (
    hackathon_id, title, theme, description, start_date, end_date, registration_deadline,
    max_participants, current_participants, min_team_size, max_team_size, prize_pool,
    status, is_online, venue, organizer_id, organizer_name
) VALUES
(1, 'BITS Innovation Challenge 2025', 'AI & Sustainability', 'Build AI-powered solutions for environmental sustainability. Open to all BITS students across campuses.', '2026-06-15 09:00:00', '2026-06-17 18:00:00', '2026-06-10 23:59:59', 200, 0, 2, 4, 'AED 50,000', 'OPEN', FALSE, 'BITS Pilani, Rajasthan', 1, 'BITS CS Dept'),
(2, 'FinTech Hackathon 2025', 'Future of Finance', 'Reimagine financial services using blockchain, ML, and open banking APIs.', '2026-07-01 09:00:00', '2026-07-02 18:00:00', '2026-06-25 23:59:59', 150, 0, 1, 3, 'AED 25,000', 'OPEN', TRUE, NULL, 1, 'FinHub BITS'),
(3, 'HealthTech Sprint', 'Digital Healthcare', 'Develop solutions for healthcare accessibility, telemedicine, and medical data analysis.', '2026-05-20 09:00:00', '2026-05-21 18:00:00', '2026-05-15 23:59:59', 100, 0, 2, 4, 'AED 15,000', 'IN_PROGRESS', FALSE, 'BITS Hyderabad', 1, 'MedTech Club'),
(4, 'Cyber Security Hackathon', 'Hack the Hackers', 'CTF-style hackathon focusing on network security, cryptography, and ethical hacking.', '2026-08-10 09:00:00', '2026-08-12 18:00:00', '2026-08-01 23:59:59', 80, 0, 2, 3, 'AED 30,000', 'UPCOMING', TRUE, NULL, 1, 'SecBITS'),
(5, 'Smart Campus Hackathon', 'IoT & Automation', 'Build smart solutions for campus management from parking to energy efficiency.', '2026-04-01 09:00:00', '2026-04-03 18:00:00', '2026-03-25 23:59:59', 120, 0, 2, 4, 'AED 10,000', 'COMPLETED', FALSE, 'BITS Goa', 1, 'IEEE BITS'),
(6, 'Open Source Sprint', 'Build for the Community', 'Contribute to open-source projects and build tools that developers love.', '2026-09-05 09:00:00', '2026-09-07 18:00:00', '2026-08-30 23:59:59', 300, 0, 1, 5, 'AED 7,500', 'UPCOMING', TRUE, NULL, 1, 'BITS OSS Club');

INSERT IGNORE INTO hackathon_tags (hackathon_id, tag_name) VALUES
(1, 'AI'), (1, 'ML'), (1, 'Sustainability'), (1, 'Python'),
(2, 'Blockchain'), (2, 'FinTech'), (2, 'ML'), (2, 'APIs'),
(3, 'Healthcare'), (3, 'AI'), (3, 'Mobile'), (3, 'IoT'),
(4, 'Security'), (4, 'CTF'), (4, 'Networking'), (4, 'Python'),
(5, 'IoT'), (5, 'Hardware'), (5, 'Automation'), (5, 'BITS'),
(6, 'Open Source'), (6, 'GitHub'), (6, 'Community'), (6, 'Web');

INSERT IGNORE INTO teams (team_id, team_name, description, hackathon_id, leader_id, max_size, is_open) VALUES
(1, 'Neural Nexus', 'Building an AI-powered carbon footprint tracker with real-time analytics.', 1, 101, 4, TRUE),
(2, 'BlockBusters', 'DeFi lending platform with AI risk assessment for underbanked populations.', 2, 104, 3, TRUE),
(3, 'MedAI', 'AI diagnostic assistant that helps rural doctors with image-based disease detection.', 3, 106, 4, FALSE),
(4, 'SecureX', 'Advanced threat detection system using ML and behavioral analytics.', 4, 109, 3, TRUE);

INSERT IGNORE INTO team_members (team_id, user_id, role, is_leader, status) VALUES
(1, 101, 'Full Stack Dev', TRUE, 'ACTIVE'),
(1, 102, 'ML Engineer', FALSE, 'ACTIVE'),
(1, 103, 'Backend Dev', FALSE, 'ACTIVE'),
(2, 104, 'Blockchain Dev', TRUE, 'ACTIVE'),
(2, 105, 'ML Dev', FALSE, 'ACTIVE'),
(3, 106, 'Lead Dev', TRUE, 'ACTIVE'),
(3, 107, 'Backend', FALSE, 'ACTIVE'),
(3, 108, 'UI/UX', FALSE, 'ACTIVE'),
(3, 109, 'ML Specialist', FALSE, 'ACTIVE'),
(4, 109, 'Security Expert', TRUE, 'ACTIVE');

INSERT IGNORE INTO team_required_skills (team_id, skill_id) VALUES
(1, 9), (1, 10),
(2, 1), (2, 2),
(4, 3), (4, 4), (4, 13);

INSERT IGNORE INTO registrations (hackathon_id, user_id, team_id, status) VALUES
(1, 101, 1, 'CONFIRMED'), (1, 102, 1, 'CONFIRMED'), (1, 103, 1, 'CONFIRMED'), (1, 2, NULL, 'CONFIRMED'),
(2, 104, 2, 'CONFIRMED'), (2, 105, 2, 'CONFIRMED'), (2, 2, NULL, 'CONFIRMED'),
(3, 106, 3, 'CONFIRMED'), (3, 107, 3, 'CONFIRMED'), (3, 108, 3, 'CONFIRMED'), (3, 109, 3, 'CONFIRMED');

UPDATE hackathons h
SET current_participants = (
    SELECT COUNT(*)
    FROM registrations r
    WHERE r.hackathon_id = h.hackathon_id AND r.status = 'CONFIRMED'
);

INSERT IGNORE INTO submissions (
    submission_id, hackathon_id, team_id, user_id, project_title, description, repo_url, demo_url, status, submitted_at, score
) VALUES
(1, 1, 1, 101, 'CarbonSense AI', 'Real-time carbon footprint tracker using satellite data and ML models.', 'https://github.com/example/carbonsense', 'https://carbonsense.demo.com', 'EVALUATED', '2026-06-17 17:30:00', 91.20),
(2, 2, 2, 104, 'DeFi Lending Protocol', 'Decentralized lending with AI-based credit scoring for underbanked users.', 'https://github.com/example/defijl', NULL, 'EVALUATED', '2026-07-02 17:45:00', 88.70),
(3, 3, 3, 106, 'AI Diagnostic Assistant', 'Image-based diagnostic helper for rural clinics.', 'https://github.com/example/medai', NULL, 'EVALUATED', '2026-05-21 17:40:00', 94.50);

INSERT IGNORE INTO submission_tech_stack (submission_id, tech_name) VALUES
(1, 'React'), (1, 'Python'), (1, 'TensorFlow'), (1, 'Spring Boot'),
(2, 'Solidity'), (2, 'React'), (2, 'Python'), (2, 'Node.js'),
(3, 'Python'), (3, 'Computer Vision'), (3, 'React');

INSERT IGNORE INTO evaluation_criteria (criterion_id, hackathon_id, criterion_key, label, max_score, display_order) VALUES
(1, NULL, 'innovation', 'Innovation', 20.00, 1),
(2, NULL, 'implementation', 'Implementation', 20.00, 2),
(3, NULL, 'presentation', 'Presentation', 20.00, 3),
(4, NULL, 'impact', 'Impact', 20.00, 4),
(5, NULL, 'feasibility', 'Feasibility', 20.00, 5);

INSERT IGNORE INTO evaluations (evaluation_id, submission_id, judge_id, total_score, feedback, evaluated_at) VALUES
(1, 1, 3, 91.20, 'Strong implementation and clear sustainability impact.', '2026-06-17 19:00:00'),
(2, 2, 3, 88.70, 'Good fintech use case with polished blockchain integration.', '2026-07-02 19:00:00'),
(3, 3, 3, 94.50, 'Excellent healthcare relevance and technical depth.', '2026-05-21 19:00:00');

INSERT IGNORE INTO evaluation_scores (evaluation_id, criterion_id, score) VALUES
(1, 1, 18.5), (1, 2, 18.2), (1, 3, 17.8), (1, 4, 19.0), (1, 5, 17.7),
(2, 1, 18.0), (2, 2, 17.8), (2, 3, 17.2), (2, 4, 18.4), (2, 5, 17.3),
(3, 1, 19.2), (3, 2, 18.8), (3, 3, 18.6), (3, 4, 19.3), (3, 5, 18.6);

INSERT IGNORE INTO mentors (mentor_id, user_id, company, designation, rating, total_sessions, is_active) VALUES
(1, 201, 'Google DeepMind', 'Senior Research Scientist', 4.90, 156, TRUE),
(2, 202, 'Stripe', 'Engineering Manager', 4.70, 89, TRUE),
(3, 203, 'Microsoft Azure', 'Principal Cloud Architect', 4.80, 212, TRUE);

INSERT IGNORE INTO mentor_expertise (mentor_id, skill_id) VALUES
(1, 4), (1, 3), (1, 16),
(2, 17), (2, 11), (2, 18), (2, 1),
(3, 15), (3, 13), (3, 14);

INSERT IGNORE INTO mentor_slots (slot_id, mentor_id, start_time, end_time, status, booked_by_team_id, booked_by_user_id) VALUES
(1, 1, '2026-06-15 10:00:00', '2026-06-15 10:30:00', 'AVAILABLE', NULL, NULL),
(2, 1, '2026-06-15 11:00:00', '2026-06-15 11:30:00', 'AVAILABLE', NULL, NULL),
(3, 1, '2026-06-16 14:00:00', '2026-06-16 14:30:00', 'AVAILABLE', NULL, NULL),
(4, 2, '2026-06-15 09:00:00', '2026-06-15 09:30:00', 'AVAILABLE', NULL, NULL),
(5, 2, '2026-06-15 15:00:00', '2026-06-15 15:30:00', 'AVAILABLE', NULL, NULL),
(6, 3, '2026-06-16 10:00:00', '2026-06-16 10:30:00', 'AVAILABLE', NULL, NULL);

INSERT IGNORE INTO mentor_bookings (booking_id, slot_id, mentor_id, team_id, user_id, status, notes) VALUES
(1, 2, 1, 1, 101, 'CONFIRMED', 'Review ML model architecture');

UPDATE mentor_slots
SET status = 'BOOKED', booked_by_team_id = 1, booked_by_user_id = 101
WHERE slot_id = 2;

UPDATE mentors
SET total_sessions = 156
WHERE mentor_id = 1;

INSERT IGNORE INTO resources (resource_id, title, url, display_order, is_active) VALUES
(1, 'React + Vite Guide', 'https://vitejs.dev/guide/', 1, TRUE),
(2, 'Spring Boot Guides', 'https://spring.io/guides', 2, TRUE),
(3, 'GitHub Docs', 'https://docs.github.com/', 3, TRUE),
(4, 'MySQL Documentation', 'https://dev.mysql.com/doc/', 4, TRUE),
(5, 'MDN Web Docs', 'https://developer.mozilla.org/', 5, TRUE);
