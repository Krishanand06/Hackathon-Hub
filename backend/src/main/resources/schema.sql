-- BITS Hackathon Hub Database Schema

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('STUDENT', 'MENTOR', 'JUDGE', 'ADMIN') NOT NULL,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Hackathons Table
CREATE TABLE IF NOT EXISTS hackathons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    registration_deadline DATETIME NOT NULL,
    max_participants INT,
    current_participants INT DEFAULT 0,
    min_team_size INT DEFAULT 1,
    max_team_size INT DEFAULT 4,
    prize_pool VARCHAR(100),
    is_online BOOLEAN DEFAULT TRUE,
    venue VARCHAR(255),
    status ENUM('UPCOMING', 'OPEN', 'IN_PROGRESS', 'JUDGING', 'COMPLETED') NOT NULL
);

-- 3. Teams Table
CREATE TABLE IF NOT EXISTS teams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    hackathon_id BIGINT NOT NULL,
    leader_id BIGINT NOT NULL,
    max_size INT DEFAULT 4,
    is_open BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (hackathon_id) REFERENCES hackathons(id) ON DELETE CASCADE,
    FOREIGN KEY (leader_id) REFERENCES users(id)
);

-- 4. Team Members Join Table
CREATE TABLE IF NOT EXISTS team_members (
    team_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    PRIMARY KEY (team_id, user_id),
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_title VARCHAR(255) NOT NULL,
    description TEXT,
    hackathon_id BIGINT NOT NULL,
    team_id BIGINT,
    user_id BIGINT NOT NULL,
    repo_url VARCHAR(255),
    demo_url VARCHAR(255),
    submitted_at DATETIME,
    status ENUM('PENDING', 'EVALUATED') DEFAULT 'PENDING',
    score DOUBLE,
    feedback TEXT,
    FOREIGN KEY (hackathon_id) REFERENCES hackathons(id),
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ─── ADVANCED MYSQL FEATURES ───────────────────────────────────

-- TRIGGER: Automatically update current_participants when someone joins a team
DELIMITER //
CREATE TRIGGER IF NOT EXISTS after_team_member_insert
AFTER INSERT ON team_members
FOR EACH ROW
BEGIN
    DECLARE h_id BIGINT;
    SELECT hackathon_id INTO h_id FROM teams WHERE id = NEW.team_id;
    UPDATE hackathons 
    SET current_participants = current_participants + 1 
    WHERE id = h_id;
END //
DELIMITER ;

-- PROCEDURE: Get leaderboard for a specific hackathon
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS GetHackathonLeaderboard(IN h_id BIGINT)
BEGIN
    SELECT 
        t.name as team_name, 
        s.project_title, 
        s.score 
    FROM submissions s
    JOIN teams t ON s.team_id = t.id
    WHERE s.hackathon_id = h_id AND s.status = 'EVALUATED'
    ORDER BY s.score DESC;
END //
DELIMITER ;
