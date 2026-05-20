package edu.bits.hackathonhub.repository;

import edu.bits.hackathonhub.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByHackathonId(Long hackathonId);
    List<Submission> findByTeamId(Long teamId);
    List<Submission> findBySubmittedById(Long userId);
    boolean existsByHackathonIdAndTeamId(Long hackathonId, Long teamId);
}
