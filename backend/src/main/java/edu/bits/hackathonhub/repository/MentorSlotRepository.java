package edu.bits.hackathonhub.repository;

import edu.bits.hackathonhub.model.MentorSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MentorSlotRepository extends JpaRepository<MentorSlot, Long> {
    List<MentorSlot> findByMentorId(Long mentorId);
    List<MentorSlot> findByMentorIdAndIsBookedFalse(Long mentorId);
    List<MentorSlot> findByBookedById(Long userId);
}
