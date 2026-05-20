package edu.bits.hackathonhub.service;

import edu.bits.hackathonhub.model.MentorSlot;
import edu.bits.hackathonhub.model.User;
import edu.bits.hackathonhub.repository.MentorSlotRepository;
import edu.bits.hackathonhub.repository.UserRepository;
import edu.bits.hackathonhub.repository.MentorRepository;
import edu.bits.hackathonhub.model.MentorDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
                        .userId(m.getUser().getId())
                        .fullName(m.getUser().getFullName())
                        .company(m.getCompany())
                        .designation(m.getDesignation())
                        .rating(m.getRating() != null ? m.getRating() : 0.0)
                        .totalSessions(m.getTotalSessions() != null ? m.getTotalSessions() : 0)
                        .bio(m.getUser().getBio())
                        // Note: expertise requires proper mapping if needed, simplified here
                        .expertise(List.of("General"))
                        .availableSlots(slotRepository.findByMentorIdOrderByStartTimeAsc(m.getId()))
                        .build())
                .toList();
    }

    public MentorDTO getMentorByUserId(Long userId) {
        return mentorRepository.findByUserId(userId)
                .map(m -> MentorDTO.builder()
                        .id(m.getId())
                        .userId(m.getUser().getId())
                        .fullName(m.getUser().getFullName())
                        .company(m.getCompany())
                        .designation(m.getDesignation())
                        .rating(m.getRating() != null ? m.getRating() : 0.0)
                        .totalSessions(m.getTotalSessions() != null ? m.getTotalSessions() : 0)
                        .bio(m.getUser().getBio())
                        .expertise(List.of("General"))
                        .availableSlots(slotRepository.findByMentorIdOrderByStartTimeAsc(m.getId()))
                        .build())
                .orElse(null);
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

    public MentorSlot createSlot(Long mentorId, String startTime, String endTime) {
        if (!mentorRepository.existsById(mentorId)) {
            throw new RuntimeException("Mentor not found");
        }

        MentorSlot slot = MentorSlot.builder()
                .mentorId(mentorId)
                .startTime(LocalDateTime.parse(startTime))
                .endTime(LocalDateTime.parse(endTime))
                .status(MentorSlot.SlotStatus.AVAILABLE)
                .build();

        return slotRepository.save(slot);
    }

    public MentorSlot updateSlotAvailability(Long slotId, boolean isAvailable) {
        MentorSlot slot = slotRepository.findById(slotId).orElseThrow();
        if (slot.isBooked()) {
            throw new RuntimeException("Booked slots cannot be hidden");
        }

        slot.setStatus(isAvailable ? MentorSlot.SlotStatus.AVAILABLE : MentorSlot.SlotStatus.CANCELLED);
        return slotRepository.save(slot);
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
