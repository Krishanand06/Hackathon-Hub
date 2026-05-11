package edu.bits.hackathonhub.service;

import edu.bits.hackathonhub.model.MentorSlot;
import edu.bits.hackathonhub.model.User;
import edu.bits.hackathonhub.repository.MentorSlotRepository;
import edu.bits.hackathonhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MentorService {

    private final MentorSlotRepository slotRepository;
    private final UserRepository userRepository;

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
}
