-- BITS Hackathon Hub DBMS Schema
-- Scope: only the data needed by the current website screens and API surface.
-- Target database: MySQL 8+

SET FOREIGN_KEY_CHECKS = 0;

DROP VIEW IF EXISTS vw_user_dashboard;
DROP VIEW IF EXISTS vw_resource_cards;
DROP VIEW IF EXISTS vw_mentor_cards;
DROP VIEW IF EXISTS vw_leaderboard;
DROP VIEW IF EXISTS vw_team_cards;
DROP VIEW IF EXISTS vw_hackathon_cards;

DROP TRIGGER IF EXISTS trg_hackathons_bi_validate;
DROP TRIGGER IF EXISTS trg_hackathons_bu_validate;
DROP TRIGGER IF EXISTS trg_team_members_bi_validate;
DROP TRIGGER IF EXISTS trg_team_members_ai_status;
DROP TRIGGER IF EXISTS trg_team_members_au_status;
DROP TRIGGER IF EXISTS trg_team_members_ad_status;
DROP TRIGGER IF EXISTS trg_registrations_bi_validate;
DROP TRIGGER IF EXISTS trg_registrations_ai_count;
DROP TRIGGER IF EXISTS trg_registrations_au_count;
DROP TRIGGER IF EXISTS trg_registrations_ad_count;
DROP TRIGGER IF EXISTS trg_submissions_bi_validate;
DROP TRIGGER IF EXISTS trg_evaluations_bi_defaults;
DROP TRIGGER IF EXISTS trg_evaluation_scores_bi_validate;
DROP TRIGGER IF EXISTS trg_evaluation_scores_bu_validate;
DROP TRIGGER IF EXISTS trg_evaluation_scores_ai_total;
DROP TRIGGER IF EXISTS trg_evaluation_scores_au_total;
DROP TRIGGER IF EXISTS trg_evaluation_scores_ad_total;
DROP TRIGGER IF EXISTS trg_mentor_bookings_bi_validate;
DROP TRIGGER IF EXISTS trg_mentor_bookings_ai_slot;
DROP TRIGGER IF EXISTS trg_mentor_bookings_au_slot;

DROP PROCEDURE IF EXISTS sp_register_for_hackathon;
DROP PROCEDURE IF EXISTS sp_create_team;
DROP PROCEDURE IF EXISTS sp_join_team;
DROP PROCEDURE IF EXISTS sp_submit_project;
DROP PROCEDURE IF EXISTS sp_record_evaluation;
DROP PROCEDURE IF EXISTS sp_book_mentor_slot;
DROP PROCEDURE IF EXISTS sp_get_leaderboard;
DROP PROCEDURE IF EXISTS sp_get_user_dashboard;
DROP PROCEDURE IF EXISTS sp_find_open_teams_for_skills;
DROP PROCEDURE IF EXISTS sp_refresh_hackathon_statuses;

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS mentor_bookings;
DROP TABLE IF EXISTS mentor_slots;
DROP TABLE IF EXISTS mentor_expertise;
DROP TABLE IF EXISTS mentors;
DROP TABLE IF EXISTS evaluation_scores;
DROP TABLE IF EXISTS evaluations;
DROP TABLE IF EXISTS evaluation_criteria;
DROP TABLE IF EXISTS submission_tech_stack;
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS team_required_skills;
DROP TABLE IF EXISTS team_members;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS hackathon_tags;
DROP TABLE IF EXISTS hackathons;
DROP TABLE IF EXISTS user_skills;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    role ENUM('STUDENT', 'MENTOR', 'JUDGE', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    bio TEXT,
    github_url VARCHAR(255),
    avatar_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_users_email CHECK (email LIKE '%@%')
);

CREATE TABLE skills (
    skill_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL UNIQUE,
    category ENUM('FRONTEND', 'BACKEND', 'DATABASE', 'AI_ML', 'DESIGN', 'BLOCKCHAIN', 'CLOUD', 'CYBERSECURITY', 'PRODUCT', 'OTHER') NOT NULL DEFAULT 'OTHER',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_skills (
    user_skill_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    proficiency_level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT') NOT NULL DEFAULT 'INTERMEDIATE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_skills_user_skill UNIQUE (user_id, skill_id),
    CONSTRAINT fk_user_skills_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_skills_skill FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
);

CREATE TABLE hackathons (
    hackathon_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    theme VARCHAR(150),
    description TEXT NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    registration_deadline DATETIME NOT NULL,
    max_participants INT UNSIGNED NOT NULL,
    current_participants INT UNSIGNED NOT NULL DEFAULT 0,
    min_team_size TINYINT UNSIGNED NOT NULL DEFAULT 1,
    max_team_size TINYINT UNSIGNED NOT NULL DEFAULT 4,
    prize_pool VARCHAR(100),
    status ENUM('UPCOMING', 'OPEN', 'IN_PROGRESS', 'JUDGING', 'COMPLETED') NOT NULL DEFAULT 'UPCOMING',
    is_online BOOLEAN NOT NULL DEFAULT TRUE,
    venue VARCHAR(255),
    organizer_id BIGINT,
    organizer_name VARCHAR(120) NOT NULL,
    banner_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_hackathons_dates CHECK (start_date < end_date AND registration_deadline <= start_date),
    CONSTRAINT chk_hackathons_team_size CHECK (min_team_size BETWEEN 1 AND max_team_size),
    CONSTRAINT chk_hackathons_capacity CHECK (max_participants > 0),
    CONSTRAINT fk_hackathons_organizer FOREIGN KEY (organizer_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE hackathon_tags (
    hackathon_tag_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hackathon_id BIGINT NOT NULL,
    tag_name VARCHAR(60) NOT NULL,
    CONSTRAINT uq_hackathon_tags UNIQUE (hackathon_id, tag_name),
    CONSTRAINT fk_hackathon_tags_hackathon FOREIGN KEY (hackathon_id) REFERENCES hackathons(hackathon_id) ON DELETE CASCADE
);

CREATE TABLE teams (
    team_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(120) NOT NULL,
    description TEXT,
    hackathon_id BIGINT NOT NULL,
    leader_id BIGINT NOT NULL,
    max_size TINYINT UNSIGNED NOT NULL DEFAULT 4,
    is_open BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_teams_hackathon_name UNIQUE (hackathon_id, team_name),
    CONSTRAINT chk_teams_max_size CHECK (max_size BETWEEN 1 AND 8),
    CONSTRAINT fk_teams_hackathon FOREIGN KEY (hackathon_id) REFERENCES hackathons(hackathon_id) ON DELETE CASCADE,
    CONSTRAINT fk_teams_leader FOREIGN KEY (leader_id) REFERENCES users(user_id) ON DELETE RESTRICT
);

CREATE TABLE team_members (
    team_member_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    team_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(60) NOT NULL DEFAULT 'Member',
    is_leader BOOLEAN NOT NULL DEFAULT FALSE,
    status ENUM('ACTIVE', 'LEFT', 'REMOVED') NOT NULL DEFAULT 'ACTIVE',
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_team_members_team_user UNIQUE (team_id, user_id),
    CONSTRAINT fk_team_members_team FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    CONSTRAINT fk_team_members_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE team_required_skills (
    team_required_skill_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    team_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    CONSTRAINT uq_team_required_skills UNIQUE (team_id, skill_id),
    CONSTRAINT fk_team_required_skills_team FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    CONSTRAINT fk_team_required_skills_skill FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
);

CREATE TABLE registrations (
    registration_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hackathon_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    team_id BIGINT,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED') NOT NULL DEFAULT 'CONFIRMED',
    registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_registrations_hackathon_user UNIQUE (hackathon_id, user_id),
    CONSTRAINT fk_registrations_hackathon FOREIGN KEY (hackathon_id) REFERENCES hackathons(hackathon_id) ON DELETE CASCADE,
    CONSTRAINT fk_registrations_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_registrations_team FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE SET NULL
);

CREATE TABLE submissions (
    submission_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hackathon_id BIGINT NOT NULL,
    team_id BIGINT,
    user_id BIGINT NOT NULL,
    project_title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    repo_url VARCHAR(255) NOT NULL,
    demo_url VARCHAR(255),
    presentation_url VARCHAR(255),
    status ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'EVALUATED') NOT NULL DEFAULT 'SUBMITTED',
    submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    score DECIMAL(5,2),
    feedback TEXT,
    CONSTRAINT uq_submissions_hackathon_team UNIQUE (hackathon_id, team_id),
    CONSTRAINT chk_submissions_score CHECK (score IS NULL OR score BETWEEN 0 AND 100),
    CONSTRAINT fk_submissions_hackathon FOREIGN KEY (hackathon_id) REFERENCES hackathons(hackathon_id) ON DELETE CASCADE,
    CONSTRAINT fk_submissions_team FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE SET NULL,
    CONSTRAINT fk_submissions_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT
);

CREATE TABLE submission_tech_stack (
    submission_tech_stack_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    submission_id BIGINT NOT NULL,
    tech_name VARCHAR(100) NOT NULL,
    CONSTRAINT uq_submission_tech_stack UNIQUE (submission_id, tech_name),
    CONSTRAINT fk_submission_tech_stack_submission FOREIGN KEY (submission_id) REFERENCES submissions(submission_id) ON DELETE CASCADE
);

CREATE TABLE evaluation_criteria (
    criterion_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hackathon_id BIGINT,
    criterion_key VARCHAR(40) NOT NULL,
    label VARCHAR(80) NOT NULL,
    max_score DECIMAL(5,2) NOT NULL DEFAULT 20.00,
    display_order TINYINT UNSIGNED NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_evaluation_criteria UNIQUE (hackathon_id, criterion_key),
    CONSTRAINT chk_evaluation_criteria_max CHECK (max_score > 0),
    CONSTRAINT fk_evaluation_criteria_hackathon FOREIGN KEY (hackathon_id) REFERENCES hackathons(hackathon_id) ON DELETE CASCADE
);

CREATE TABLE evaluations (
    evaluation_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    submission_id BIGINT NOT NULL,
    judge_id BIGINT NOT NULL,
    total_score DECIMAL(5,2),
    feedback TEXT,
    evaluated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_evaluations_submission_judge UNIQUE (submission_id, judge_id),
    CONSTRAINT chk_evaluations_total CHECK (total_score IS NULL OR total_score BETWEEN 0 AND 100),
    CONSTRAINT fk_evaluations_submission FOREIGN KEY (submission_id) REFERENCES submissions(submission_id) ON DELETE CASCADE,
    CONSTRAINT fk_evaluations_judge FOREIGN KEY (judge_id) REFERENCES users(user_id) ON DELETE RESTRICT
);

CREATE TABLE evaluation_scores (
    evaluation_score_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    evaluation_id BIGINT NOT NULL,
    criterion_id BIGINT NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    CONSTRAINT uq_evaluation_scores UNIQUE (evaluation_id, criterion_id),
    CONSTRAINT fk_evaluation_scores_evaluation FOREIGN KEY (evaluation_id) REFERENCES evaluations(evaluation_id) ON DELETE CASCADE,
    CONSTRAINT fk_evaluation_scores_criterion FOREIGN KEY (criterion_id) REFERENCES evaluation_criteria(criterion_id) ON DELETE RESTRICT
);

CREATE TABLE mentors (
    mentor_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    company VARCHAR(120),
    designation VARCHAR(120),
    rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    total_sessions INT UNSIGNED NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT chk_mentors_rating CHECK (rating BETWEEN 0 AND 5),
    CONSTRAINT fk_mentors_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE mentor_expertise (
    mentor_expertise_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mentor_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    CONSTRAINT uq_mentor_expertise UNIQUE (mentor_id, skill_id),
    CONSTRAINT fk_mentor_expertise_mentor FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id) ON DELETE CASCADE,
    CONSTRAINT fk_mentor_expertise_skill FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
);

CREATE TABLE mentor_slots (
    slot_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mentor_id BIGINT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM('AVAILABLE', 'BOOKED', 'CANCELLED') NOT NULL DEFAULT 'AVAILABLE',
    booked_by_team_id BIGINT,
    booked_by_user_id BIGINT,
    CONSTRAINT chk_mentor_slots_time CHECK (start_time < end_time),
    CONSTRAINT fk_mentor_slots_mentor FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id) ON DELETE CASCADE,
    CONSTRAINT fk_mentor_slots_team FOREIGN KEY (booked_by_team_id) REFERENCES teams(team_id) ON DELETE SET NULL,
    CONSTRAINT fk_mentor_slots_user FOREIGN KEY (booked_by_user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE mentor_bookings (
    booking_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slot_id BIGINT NOT NULL UNIQUE,
    mentor_id BIGINT NOT NULL,
    team_id BIGINT,
    user_id BIGINT NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'CONFIRMED',
    notes TEXT,
    booked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mentor_bookings_slot FOREIGN KEY (slot_id) REFERENCES mentor_slots(slot_id) ON DELETE CASCADE,
    CONSTRAINT fk_mentor_bookings_mentor FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id) ON DELETE CASCADE,
    CONSTRAINT fk_mentor_bookings_team FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE SET NULL,
    CONSTRAINT fk_mentor_bookings_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE resources (
    resource_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    url VARCHAR(255) NOT NULL,
    display_order INT UNSIGNED NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    audit_log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_name VARCHAR(80) NOT NULL,
    entity_id BIGINT NOT NULL,
    action_name VARCHAR(80) NOT NULL,
    message VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_skills_name ON skills(skill_name);
CREATE INDEX idx_hackathons_status_dates ON hackathons(status, start_date, end_date);
CREATE INDEX idx_hackathon_tags_tag ON hackathon_tags(tag_name);
CREATE INDEX idx_teams_hackathon_open ON teams(hackathon_id, is_open);
CREATE INDEX idx_team_members_user_status ON team_members(user_id, status);
CREATE INDEX idx_registrations_user_status ON registrations(user_id, status);
CREATE INDEX idx_submissions_hackathon_status ON submissions(hackathon_id, status, score);
CREATE INDEX idx_evaluations_judge ON evaluations(judge_id);
CREATE INDEX idx_mentor_slots_mentor_status_time ON mentor_slots(mentor_id, status, start_time);
CREATE INDEX idx_resources_active_order ON resources(is_active, display_order);

DELIMITER //

CREATE TRIGGER trg_hackathons_bi_validate
BEFORE INSERT ON hackathons
FOR EACH ROW
BEGIN
    IF NEW.start_date >= NEW.end_date THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Hackathon start date must be before end date';
    END IF;
    IF NEW.registration_deadline > NEW.start_date THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registration deadline must be before the hackathon starts';
    END IF;
END//

CREATE TRIGGER trg_hackathons_bu_validate
BEFORE UPDATE ON hackathons
FOR EACH ROW
BEGIN
    IF NEW.start_date >= NEW.end_date THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Hackathon start date must be before end date';
    END IF;
    IF NEW.registration_deadline > NEW.start_date THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registration deadline must be before the hackathon starts';
    END IF;
END//

CREATE TRIGGER trg_team_members_bi_validate
BEFORE INSERT ON team_members
FOR EACH ROW
BEGIN
    DECLARE v_active_count INT DEFAULT 0;
    DECLARE v_max_size INT DEFAULT 0;

    SELECT COUNT(*) INTO v_active_count
    FROM team_members
    WHERE team_id = NEW.team_id AND status = 'ACTIVE';

    SELECT max_size INTO v_max_size
    FROM teams
    WHERE team_id = NEW.team_id;

    IF NEW.status = 'ACTIVE' AND v_active_count >= v_max_size THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Team is already full';
    END IF;
END//

CREATE TRIGGER trg_team_members_ai_status
AFTER INSERT ON team_members
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs(entity_name, entity_id, action_name, message)
    VALUES ('team_members', NEW.team_member_id, 'JOINED', 'Team member added');
END//


CREATE TRIGGER trg_registrations_bi_validate
BEFORE INSERT ON registrations
FOR EACH ROW
BEGIN
    DECLARE v_status VARCHAR(20);
    DECLARE v_deadline DATETIME;
    DECLARE v_max INT;
    DECLARE v_current INT;
    DECLARE v_team_hackathon BIGINT;

    SELECT status, registration_deadline, max_participants, current_participants
    INTO v_status, v_deadline, v_max, v_current
    FROM hackathons
    WHERE hackathon_id = NEW.hackathon_id;

    IF v_status NOT IN ('OPEN', 'IN_PROGRESS') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Hackathon registration is not open';
    END IF;
    IF NOW() > v_deadline THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registration deadline has passed';
    END IF;
    IF NEW.status = 'CONFIRMED' AND v_current >= v_max THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Hackathon is full';
    END IF;
    IF NEW.team_id IS NOT NULL THEN
        SELECT hackathon_id INTO v_team_hackathon
        FROM teams
        WHERE team_id = NEW.team_id;
        IF v_team_hackathon <> NEW.hackathon_id THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Team belongs to a different hackathon';
        END IF;
    END IF;
END//

CREATE TRIGGER trg_registrations_ai_count
AFTER INSERT ON registrations
FOR EACH ROW
BEGIN
    UPDATE hackathons
    SET current_participants = (
        SELECT COUNT(*) FROM registrations
        WHERE hackathon_id = NEW.hackathon_id AND status = 'CONFIRMED'
    )
    WHERE hackathon_id = NEW.hackathon_id;
END//

CREATE TRIGGER trg_registrations_au_count
AFTER UPDATE ON registrations
FOR EACH ROW
BEGIN
    UPDATE hackathons
    SET current_participants = (
        SELECT COUNT(*) FROM registrations
        WHERE hackathon_id = OLD.hackathon_id AND status = 'CONFIRMED'
    )
    WHERE hackathon_id = OLD.hackathon_id;

    UPDATE hackathons
    SET current_participants = (
        SELECT COUNT(*) FROM registrations
        WHERE hackathon_id = NEW.hackathon_id AND status = 'CONFIRMED'
    )
    WHERE hackathon_id = NEW.hackathon_id;
END//

CREATE TRIGGER trg_registrations_ad_count
AFTER DELETE ON registrations
FOR EACH ROW
BEGIN
    UPDATE hackathons
    SET current_participants = (
        SELECT COUNT(*) FROM registrations
        WHERE hackathon_id = OLD.hackathon_id AND status = 'CONFIRMED'
    )
    WHERE hackathon_id = OLD.hackathon_id;
END//

CREATE TRIGGER trg_submissions_bi_validate
BEFORE INSERT ON submissions
FOR EACH ROW
BEGIN
    DECLARE v_status VARCHAR(20);
    DECLARE v_team_hackathon BIGINT;

    SELECT status INTO v_status
    FROM hackathons
    WHERE hackathon_id = NEW.hackathon_id;

    IF v_status NOT IN ('OPEN', 'IN_PROGRESS', 'JUDGING') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Submissions are closed for this hackathon';
    END IF;

    IF NEW.team_id IS NOT NULL THEN
        SELECT hackathon_id INTO v_team_hackathon
        FROM teams
        WHERE team_id = NEW.team_id;
        IF v_team_hackathon <> NEW.hackathon_id THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Submission team belongs to a different hackathon';
        END IF;
    END IF;
END//

CREATE TRIGGER trg_evaluations_bi_defaults
BEFORE INSERT ON evaluations
FOR EACH ROW
BEGIN
    IF NEW.evaluated_at IS NULL THEN
        SET NEW.evaluated_at = NOW();
    END IF;
END//

CREATE TRIGGER trg_evaluation_scores_bi_validate
BEFORE INSERT ON evaluation_scores
FOR EACH ROW
BEGIN
    DECLARE v_max DECIMAL(5,2);
    SELECT max_score INTO v_max FROM evaluation_criteria WHERE criterion_id = NEW.criterion_id;
    IF NEW.score < 0 OR NEW.score > v_max THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Evaluation score is outside the criterion range';
    END IF;
END//

CREATE TRIGGER trg_evaluation_scores_bu_validate
BEFORE UPDATE ON evaluation_scores
FOR EACH ROW
BEGIN
    DECLARE v_max DECIMAL(5,2);
    SELECT max_score INTO v_max FROM evaluation_criteria WHERE criterion_id = NEW.criterion_id;
    IF NEW.score < 0 OR NEW.score > v_max THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Evaluation score is outside the criterion range';
    END IF;
END//

CREATE TRIGGER trg_evaluation_scores_ai_total
AFTER INSERT ON evaluation_scores
FOR EACH ROW
BEGIN
    UPDATE evaluations e
    SET total_score = (
        SELECT ROUND(AVG((es.score / ec.max_score) * 100), 2)
        FROM evaluation_scores es
        JOIN evaluation_criteria ec ON ec.criterion_id = es.criterion_id
        WHERE es.evaluation_id = NEW.evaluation_id
    )
    WHERE e.evaluation_id = NEW.evaluation_id;

    UPDATE submissions s
    JOIN evaluations e ON e.submission_id = s.submission_id
    SET s.score = (
        SELECT ROUND(AVG(e2.total_score), 2)
        FROM evaluations e2
        WHERE e2.submission_id = e.submission_id
    ),
    s.status = 'EVALUATED'
    WHERE e.evaluation_id = NEW.evaluation_id;
END//

CREATE TRIGGER trg_evaluation_scores_au_total
AFTER UPDATE ON evaluation_scores
FOR EACH ROW
BEGIN
    UPDATE evaluations e
    SET total_score = (
        SELECT ROUND(AVG((es.score / ec.max_score) * 100), 2)
        FROM evaluation_scores es
        JOIN evaluation_criteria ec ON ec.criterion_id = es.criterion_id
        WHERE es.evaluation_id = NEW.evaluation_id
    )
    WHERE e.evaluation_id = NEW.evaluation_id;

    UPDATE submissions s
    JOIN evaluations e ON e.submission_id = s.submission_id
    SET s.score = (
        SELECT ROUND(AVG(e2.total_score), 2)
        FROM evaluations e2
        WHERE e2.submission_id = e.submission_id
    ),
    s.status = 'EVALUATED'
    WHERE e.evaluation_id = NEW.evaluation_id;
END//

CREATE TRIGGER trg_evaluation_scores_ad_total
AFTER DELETE ON evaluation_scores
FOR EACH ROW
BEGIN
    UPDATE evaluations e
    SET total_score = (
        SELECT ROUND(AVG((es.score / ec.max_score) * 100), 2)
        FROM evaluation_scores es
        JOIN evaluation_criteria ec ON ec.criterion_id = es.criterion_id
        WHERE es.evaluation_id = OLD.evaluation_id
    )
    WHERE e.evaluation_id = OLD.evaluation_id;
END//

CREATE TRIGGER trg_mentor_bookings_bi_validate
BEFORE INSERT ON mentor_bookings
FOR EACH ROW
BEGIN
    DECLARE v_mentor_id BIGINT;
    DECLARE v_status VARCHAR(20);

    SELECT mentor_id, status INTO v_mentor_id, v_status
    FROM mentor_slots
    WHERE slot_id = NEW.slot_id;

    IF v_status <> 'AVAILABLE' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Mentor slot is not available';
    END IF;

    SET NEW.mentor_id = v_mentor_id;
END//

CREATE TRIGGER trg_mentor_bookings_ai_slot
AFTER INSERT ON mentor_bookings
FOR EACH ROW
BEGIN
    UPDATE mentor_slots
    SET status = 'BOOKED',
        booked_by_team_id = NEW.team_id,
        booked_by_user_id = NEW.user_id
    WHERE slot_id = NEW.slot_id;

    UPDATE mentors
    SET total_sessions = total_sessions + 1
    WHERE mentor_id = NEW.mentor_id;
END//

CREATE TRIGGER trg_mentor_bookings_au_slot
AFTER UPDATE ON mentor_bookings
FOR EACH ROW
BEGIN
    IF NEW.status = 'CANCELLED' AND OLD.status <> 'CANCELLED' THEN
        UPDATE mentor_slots
        SET status = 'AVAILABLE',
            booked_by_team_id = NULL,
            booked_by_user_id = NULL
        WHERE slot_id = NEW.slot_id;
    END IF;
END//

CREATE PROCEDURE sp_register_for_hackathon(
    IN p_user_id BIGINT,
    IN p_hackathon_id BIGINT,
    IN p_team_id BIGINT
)
BEGIN
    INSERT INTO registrations (hackathon_id, user_id, team_id, status)
    VALUES (p_hackathon_id, p_user_id, p_team_id, 'CONFIRMED')
    ON DUPLICATE KEY UPDATE
        team_id = VALUES(team_id),
        status = 'CONFIRMED';
END//

CREATE PROCEDURE sp_create_team(
    IN p_hackathon_id BIGINT,
    IN p_leader_id BIGINT,
    IN p_team_name VARCHAR(120),
    IN p_description TEXT,
    IN p_max_size TINYINT UNSIGNED
)
BEGIN
    DECLARE v_team_id BIGINT;
    DECLARE v_max_size TINYINT UNSIGNED;

    SELECT COALESCE(p_max_size, max_team_size) INTO v_max_size
    FROM hackathons
    WHERE hackathon_id = p_hackathon_id;

    INSERT INTO teams (team_name, description, hackathon_id, leader_id, max_size)
    VALUES (p_team_name, p_description, p_hackathon_id, p_leader_id, v_max_size);

    SET v_team_id = LAST_INSERT_ID();

    INSERT INTO team_members (team_id, user_id, role, is_leader)
    VALUES (v_team_id, p_leader_id, 'Team Leader', TRUE);

    SELECT v_team_id AS team_id;
END//

CREATE PROCEDURE sp_join_team(
    IN p_team_id BIGINT,
    IN p_user_id BIGINT,
    IN p_role VARCHAR(60)
)
BEGIN
    INSERT INTO team_members (team_id, user_id, role, is_leader, status)
    VALUES (p_team_id, p_user_id, COALESCE(p_role, 'Member'), FALSE, 'ACTIVE')
    ON DUPLICATE KEY UPDATE
        role = VALUES(role),
        status = 'ACTIVE';
END//

CREATE PROCEDURE sp_submit_project(
    IN p_hackathon_id BIGINT,
    IN p_team_id BIGINT,
    IN p_user_id BIGINT,
    IN p_project_title VARCHAR(255),
    IN p_description TEXT,
    IN p_repo_url VARCHAR(255),
    IN p_demo_url VARCHAR(255),
    IN p_tech_stack_json JSON
)
BEGIN
    DECLARE v_submission_id BIGINT;

    INSERT INTO submissions (
        hackathon_id, team_id, user_id, project_title, description, repo_url, demo_url, status
    )
    VALUES (
        p_hackathon_id, p_team_id, p_user_id, p_project_title, p_description, p_repo_url, p_demo_url, 'SUBMITTED'
    );

    SET v_submission_id = LAST_INSERT_ID();

    INSERT INTO submission_tech_stack (submission_id, tech_name)
    SELECT v_submission_id, jt.tech_name
    FROM JSON_TABLE(p_tech_stack_json, '$[*]' COLUMNS (tech_name VARCHAR(100) PATH '$')) jt
    WHERE jt.tech_name IS NOT NULL AND jt.tech_name <> '';

    SELECT v_submission_id AS submission_id;
END//

CREATE PROCEDURE sp_record_evaluation(
    IN p_submission_id BIGINT,
    IN p_judge_id BIGINT,
    IN p_feedback TEXT,
    IN p_innovation DECIMAL(5,2),
    IN p_implementation DECIMAL(5,2),
    IN p_presentation DECIMAL(5,2),
    IN p_impact DECIMAL(5,2),
    IN p_feasibility DECIMAL(5,2)
)
BEGIN
    DECLARE v_evaluation_id BIGINT;
    DECLARE v_hackathon_id BIGINT;

    SELECT hackathon_id INTO v_hackathon_id
    FROM submissions
    WHERE submission_id = p_submission_id;

    INSERT INTO evaluations (submission_id, judge_id, feedback)
    VALUES (p_submission_id, p_judge_id, p_feedback)
    ON DUPLICATE KEY UPDATE feedback = VALUES(feedback), evaluated_at = NOW();

    SELECT evaluation_id INTO v_evaluation_id
    FROM evaluations
    WHERE submission_id = p_submission_id AND judge_id = p_judge_id;

    INSERT INTO evaluation_scores (evaluation_id, criterion_id, score)
    SELECT v_evaluation_id, criterion_id,
        CASE criterion_key
            WHEN 'innovation' THEN p_innovation
            WHEN 'implementation' THEN p_implementation
            WHEN 'presentation' THEN p_presentation
            WHEN 'impact' THEN p_impact
            WHEN 'feasibility' THEN p_feasibility
        END
    FROM evaluation_criteria
    WHERE is_active = TRUE
      AND criterion_key IN ('innovation', 'implementation', 'presentation', 'impact', 'feasibility')
      AND (hackathon_id = v_hackathon_id OR hackathon_id IS NULL)
    ON DUPLICATE KEY UPDATE score = VALUES(score);
END//

CREATE PROCEDURE sp_book_mentor_slot(
    IN p_slot_id BIGINT,
    IN p_user_id BIGINT,
    IN p_team_id BIGINT,
    IN p_notes TEXT
)
BEGIN
    INSERT INTO mentor_bookings (slot_id, mentor_id, team_id, user_id, notes, status)
    VALUES (p_slot_id, 0, p_team_id, p_user_id, p_notes, 'CONFIRMED');
END//

CREATE PROCEDURE sp_get_leaderboard(IN p_hackathon_id BIGINT)
BEGIN
    SELECT *
    FROM vw_leaderboard
    WHERE p_hackathon_id IS NULL OR hackathon_id = p_hackathon_id
    ORDER BY hackathon_id, leaderboard_rank;
END//

CREATE PROCEDURE sp_get_user_dashboard(IN p_user_id BIGINT)
BEGIN
    SELECT *
    FROM vw_user_dashboard
    WHERE user_id = p_user_id;
END//

CREATE PROCEDURE sp_find_open_teams_for_skills(IN p_skill_names_json JSON)
BEGIN
    SELECT DISTINCT tc.*
    FROM vw_team_cards tc
    JOIN team_required_skills trs ON trs.team_id = tc.team_id
    JOIN skills s ON s.skill_id = trs.skill_id
    JOIN JSON_TABLE(p_skill_names_json, '$[*]' COLUMNS (skill_name VARCHAR(100) PATH '$')) jt
        ON jt.skill_name = s.skill_name
    WHERE tc.is_open = TRUE
    ORDER BY tc.member_count ASC, tc.team_name;
END//

CREATE PROCEDURE sp_refresh_hackathon_statuses()
BEGIN
    UPDATE hackathons
    SET status = CASE
        WHEN NOW() < registration_deadline THEN 'OPEN'
        WHEN NOW() BETWEEN registration_deadline AND start_date THEN 'UPCOMING'
        WHEN NOW() BETWEEN start_date AND end_date THEN 'IN_PROGRESS'
        WHEN NOW() > end_date AND status <> 'COMPLETED' THEN 'JUDGING'
        ELSE status
    END;
END//

DELIMITER ;

CREATE VIEW vw_hackathon_cards AS
SELECT
    h.hackathon_id,
    h.title,
    h.theme,
    h.description,
    h.start_date,
    h.end_date,
    h.registration_deadline,
    h.max_team_size,
    h.min_team_size,
    h.max_participants,
    h.current_participants,
    h.prize_pool,
    h.status,
    h.is_online,
    h.venue,
    h.organizer_id,
    h.organizer_name,
    h.banner_url,
    COALESCE(GROUP_CONCAT(ht.tag_name ORDER BY ht.tag_name SEPARATOR ','), '') AS tags
FROM hackathons h
LEFT JOIN hackathon_tags ht ON ht.hackathon_id = h.hackathon_id
GROUP BY
    h.hackathon_id, h.title, h.theme, h.description, h.start_date, h.end_date,
    h.registration_deadline, h.max_team_size, h.min_team_size, h.max_participants,
    h.current_participants, h.prize_pool, h.status, h.is_online, h.venue,
    h.organizer_id, h.organizer_name, h.banner_url;

CREATE VIEW vw_team_cards AS
SELECT
    t.team_id,
    t.team_name,
    t.description,
    t.hackathon_id,
    h.title AS hackathon_title,
    t.leader_id,
    u.full_name AS leader_name,
    t.max_size,
    t.is_open,
    COUNT(CASE WHEN tm.status = 'ACTIVE' THEN 1 END) AS member_count,
    COALESCE(GROUP_CONCAT(DISTINCT s.skill_name ORDER BY s.skill_name SEPARATOR ','), '') AS required_skills
FROM teams t
JOIN hackathons h ON h.hackathon_id = t.hackathon_id
JOIN users u ON u.user_id = t.leader_id
LEFT JOIN team_members tm ON tm.team_id = t.team_id
LEFT JOIN team_required_skills trs ON trs.team_id = t.team_id
LEFT JOIN skills s ON s.skill_id = trs.skill_id
GROUP BY
    t.team_id, t.team_name, t.description, t.hackathon_id, h.title,
    t.leader_id, u.full_name, t.max_size, t.is_open;

CREATE VIEW vw_leaderboard AS
SELECT
    RANK() OVER (PARTITION BY s.hackathon_id ORDER BY s.score DESC, s.submitted_at ASC) AS leaderboard_rank,
    s.hackathon_id,
    s.submission_id,
    s.team_id,
    COALESCE(t.team_name, u.username) AS team_name,
    s.project_title,
    s.score AS total_score,
    s.submitted_at
FROM submissions s
LEFT JOIN teams t ON t.team_id = s.team_id
JOIN users u ON u.user_id = s.user_id
WHERE s.status = 'EVALUATED' AND s.score IS NOT NULL;

CREATE VIEW vw_mentor_cards AS
SELECT
    m.mentor_id,
    m.user_id,
    u.full_name,
    u.email,
    u.bio,
    u.avatar_url,
    m.company,
    m.designation,
    m.rating,
    m.total_sessions,
    COALESCE(GROUP_CONCAT(DISTINCT s.skill_name ORDER BY s.skill_name SEPARATOR ','), '') AS expertise,
    COUNT(DISTINCT CASE WHEN ms.status = 'AVAILABLE' THEN ms.slot_id END) AS available_slot_count
FROM mentors m
JOIN users u ON u.user_id = m.user_id
LEFT JOIN mentor_expertise me ON me.mentor_id = m.mentor_id
LEFT JOIN skills s ON s.skill_id = me.skill_id
LEFT JOIN mentor_slots ms ON ms.mentor_id = m.mentor_id
WHERE m.is_active = TRUE
GROUP BY
    m.mentor_id, m.user_id, u.full_name, u.email, u.bio, u.avatar_url,
    m.company, m.designation, m.rating, m.total_sessions;

CREATE VIEW vw_resource_cards AS
SELECT
    r.resource_id,
    r.title,
    r.url,
    r.display_order
FROM resources r
WHERE r.is_active = TRUE;

CREATE VIEW vw_user_dashboard AS
SELECT
    u.user_id,
    u.username,
    u.full_name,
    u.email,
    u.role,
    COUNT(DISTINCT r.registration_id) AS active_registrations,
    COUNT(DISTINCT tm.team_id) AS active_teams,
    COUNT(DISTINCT sub.submission_id) AS submissions,
    COUNT(DISTINCT mb.booking_id) AS mentor_bookings
FROM users u
LEFT JOIN registrations r ON r.user_id = u.user_id AND r.status = 'CONFIRMED'
LEFT JOIN team_members tm ON tm.user_id = u.user_id AND tm.status = 'ACTIVE'
LEFT JOIN submissions sub ON sub.user_id = u.user_id
LEFT JOIN mentor_bookings mb ON mb.user_id = u.user_id AND mb.status IN ('PENDING', 'CONFIRMED')
GROUP BY u.user_id, u.username, u.full_name, u.email, u.role;
