-- BITS Hackathon Hub application schema
-- Kept in sync with dbms_schema.sql for the database-first implementation.
-- Run dbms_schema.sql manually in MySQL for triggers, procedures, and views.

CREATE TABLE IF NOT EXISTS users (
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
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    skill_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL UNIQUE,
    category ENUM('FRONTEND', 'BACKEND', 'DATABASE', 'AI_ML', 'DESIGN', 'BLOCKCHAIN', 'CLOUD', 'CYBERSECURITY', 'PRODUCT', 'OTHER') NOT NULL DEFAULT 'OTHER',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_skills (
    user_skill_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    proficiency_level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT') NOT NULL DEFAULT 'INTERMEDIATE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, skill_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS hackathons (
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
    FOREIGN KEY (organizer_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS hackathon_tags (
    hackathon_tag_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hackathon_id BIGINT NOT NULL,
    tag_name VARCHAR(60) NOT NULL,
    UNIQUE (hackathon_id, tag_name),
    FOREIGN KEY (hackathon_id) REFERENCES hackathons(hackathon_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS teams (
    team_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(120) NOT NULL,
    description TEXT,
    hackathon_id BIGINT NOT NULL,
    leader_id BIGINT NOT NULL,
    max_size TINYINT UNSIGNED NOT NULL DEFAULT 4,
    is_open BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (hackathon_id, team_name),
    FOREIGN KEY (hackathon_id) REFERENCES hackathons(hackathon_id) ON DELETE CASCADE,
    FOREIGN KEY (leader_id) REFERENCES users(user_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS team_members (
    team_member_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    team_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(60) NOT NULL DEFAULT 'Member',
    is_leader BOOLEAN NOT NULL DEFAULT FALSE,
    status ENUM('ACTIVE', 'LEFT', 'REMOVED') NOT NULL DEFAULT 'ACTIVE',
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (team_id, user_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS team_required_skills (
    team_required_skill_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    team_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    UNIQUE (team_id, skill_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS registrations (
    registration_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hackathon_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    team_id BIGINT,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED') NOT NULL DEFAULT 'CONFIRMED',
    registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (hackathon_id, user_id),
    FOREIGN KEY (hackathon_id) REFERENCES hackathons(hackathon_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS submissions (
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
    UNIQUE (hackathon_id, team_id),
    FOREIGN KEY (hackathon_id) REFERENCES hackathons(hackathon_id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS submission_tech_stack (
    submission_tech_stack_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    submission_id BIGINT NOT NULL,
    tech_name VARCHAR(100) NOT NULL,
    UNIQUE (submission_id, tech_name),
    FOREIGN KEY (submission_id) REFERENCES submissions(submission_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS evaluation_criteria (
    criterion_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hackathon_id BIGINT,
    criterion_key VARCHAR(40) NOT NULL,
    label VARCHAR(80) NOT NULL,
    max_score DECIMAL(5,2) NOT NULL DEFAULT 20.00,
    display_order TINYINT UNSIGNED NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (hackathon_id, criterion_key),
    FOREIGN KEY (hackathon_id) REFERENCES hackathons(hackathon_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS evaluations (
    evaluation_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    submission_id BIGINT NOT NULL,
    judge_id BIGINT NOT NULL,
    total_score DECIMAL(5,2),
    feedback TEXT,
    evaluated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (submission_id, judge_id),
    FOREIGN KEY (submission_id) REFERENCES submissions(submission_id) ON DELETE CASCADE,
    FOREIGN KEY (judge_id) REFERENCES users(user_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS evaluation_scores (
    evaluation_score_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    evaluation_id BIGINT NOT NULL,
    criterion_id BIGINT NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    UNIQUE (evaluation_id, criterion_id),
    FOREIGN KEY (evaluation_id) REFERENCES evaluations(evaluation_id) ON DELETE CASCADE,
    FOREIGN KEY (criterion_id) REFERENCES evaluation_criteria(criterion_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS mentors (
    mentor_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    company VARCHAR(120),
    designation VARCHAR(120),
    rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    total_sessions INT UNSIGNED NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mentor_expertise (
    mentor_expertise_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mentor_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    UNIQUE (mentor_id, skill_id),
    FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mentor_slots (
    slot_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mentor_id BIGINT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM('AVAILABLE', 'BOOKED', 'CANCELLED') NOT NULL DEFAULT 'AVAILABLE',
    booked_by_team_id BIGINT,
    booked_by_user_id BIGINT,
    FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id) ON DELETE CASCADE,
    FOREIGN KEY (booked_by_team_id) REFERENCES teams(team_id) ON DELETE SET NULL,
    FOREIGN KEY (booked_by_user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS mentor_bookings (
    booking_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slot_id BIGINT NOT NULL UNIQUE,
    mentor_id BIGINT NOT NULL,
    team_id BIGINT,
    user_id BIGINT NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'CONFIRMED',
    notes TEXT,
    booked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (slot_id) REFERENCES mentor_slots(slot_id) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS resources (
    resource_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    url VARCHAR(255) NOT NULL,
    display_order INT UNSIGNED NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    audit_log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_name VARCHAR(80) NOT NULL,
    entity_id BIGINT NOT NULL,
    action_name VARCHAR(80) NOT NULL,
    message VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
