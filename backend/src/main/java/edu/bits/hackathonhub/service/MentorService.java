package edu.bits.hackathonhub.service;

import edu.bits.hackathonhub.model.MentorSlot;
import edu.bits.hackathonhub.model.User;
import edu.bits.hackathonhub.repository.MentorSlotRepository;
import edu.bits.hackathonhub.repository.UserRepository;
import edu.bits.hackathonhub.repository.MentorRepository;
import edu.bits.hackathonhub.model.MentorDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MentorService {

    private final MentorSlotRepository slotRepository;
    private final UserRepository userRepository;
    private final MentorRepository mentorRepository;

    public List<MentorDTO> getAllMentors() {
        return mentorRepository.findAll().stream()
                .map(m -> MentorDTO.builder()
                        .id(m.getId())
                        .fullName(m.getUser().getFullName())
                        .company(m.getCompany())
                        .designation(m.getDesignation())
                        .rating(m.getRating() != null ? m.getRating() : 0.0)
                        .totalSessions(m.getTotalSessions() != null ? m.getTotalSessions() : 0)
                        .bio(m.getUser().getBio())
                        // Note: expertise requires proper mapping if needed, simplified here
                        .expertise(List.of("General"))
                        .availableSlots(m.getAvailableSlots())
                        .build())
                .toList();
    }

    public List<MentorSlot> getAvailableSlots(Long mentorId) {
        return slotRepository.findByMentorIdAndStatus(mentorId, MentorSlot.SlotStatus.AVAILABLE);
    }

    public MentorSlot bookSlot(Long slotId, Long userId) {
        MentorSlot slot = slotRepository.findById(slotId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        
        if (slot.isBooked()) {
            throw new RuntimeException("Slot is already booked");
        }
        
        slot.setBooked(true);
        slot.setBookedBy(user);
        return slotRepository.save(slot);
    }

    public List<MentorSlot> getBookingsByUser(Long userId) {
        return slotRepository.findByBookedById(userId);
    }

    public void cancelBooking(Long slotId, Long userId) {
        MentorSlot slot = slotRepository.findById(slotId).orElseThrow();
        if (slot.getBookedBy() != null && slot.getBookedBy().getId().equals(userId)) {
            slot.setBooked(false);
            slot.setBookedBy(null);
            slotRepository.save(slot);
        } else {
            throw new RuntimeException("Unauthorized or not booked by this user");
        }
    }
}
