package edu.bits.hackathonhub.repository;

import edu.bits.hackathonhub.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByHackathonId(Long hackathonId);
    List<Team> findByMembersId(Long userId);
    List<Team> findByIsOpenTrue();
}
