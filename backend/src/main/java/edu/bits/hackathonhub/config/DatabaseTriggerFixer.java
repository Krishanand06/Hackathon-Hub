package edu.bits.hackathonhub.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseTriggerFixer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        log.info("Starting database trigger verification/fix...");
        try {
            // Drop the old triggers to avoid any conflicts
            jdbcTemplate.execute("DROP TRIGGER IF EXISTS trg_team_members_ai_status");
            jdbcTemplate.execute("DROP TRIGGER IF EXISTS trg_team_members_au_status");
            jdbcTemplate.execute("DROP TRIGGER IF EXISTS trg_team_members_ad_status");

            // Re-create the insert trigger without updating teams.is_open
            String createAiTrigger = 
                "CREATE TRIGGER trg_team_members_ai_status " +
                "AFTER INSERT ON team_members " +
                "FOR EACH ROW " +
                "BEGIN " +
                "    INSERT INTO audit_logs(entity_name, entity_id, action_name, message) " +
                "    VALUES ('team_members', NEW.team_member_id, 'JOINED', 'Team member added'); " +
                "END";

            jdbcTemplate.execute(createAiTrigger);
            log.info("Database triggers successfully updated. Teams is_open will no longer be overridden.");
        } catch (Exception e) {
            log.error("Failed to update database triggers on startup: {}", e.getMessage());
        }
    }
}
