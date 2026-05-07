package edu.bits.hackathonhub.repository;

import edu.bits.hackathonhub.model.Hackathon;
import edu.bits.hackathonhub.model.HackathonStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HackathonRepository extends JpaRepository<Hackathon, Long> {
    List<Hackathon> findByStatus(HackathonStatus status);
}
