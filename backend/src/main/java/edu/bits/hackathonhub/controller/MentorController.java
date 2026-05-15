package edu.bits.hackathonhub.controller;

import edu.bits.hackathonhub.model.MentorSlot;
import edu.bits.hackathonhub.model.MentorDTO;
import edu.bits.hackathonhub.service.MentorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentors")
@RequiredArgsConstructor
public class MentorController {

    private final MentorService service;

    @GetMapping
    public ResponseEntity<List<MentorDTO>> getAllMentors() {
        return ResponseEntity.ok(service.getAllMentors());
    }

    @GetMapping("/{mentorId}/slots")
    public ResponseEntity<List<MentorSlot>> getAvailableSlots(@PathVariable Long mentorId) {
        return ResponseEntity.ok(service.getAvailableSlots(mentorId));
    }

    @PostMapping("/book/{slotId}")
    public ResponseEntity<MentorSlot> bookSlot(@PathVariable Long slotId, @RequestParam Long userId) {
        return ResponseEntity.ok(service.bookSlot(slotId, userId));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<MentorSlot>> getMyBookings(@RequestParam Long userId) {
        return ResponseEntity.ok(service.getBookingsByUser(userId));
    }

    @PostMapping("/cancel/{slotId}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long slotId, @RequestParam Long userId) {
        service.cancelBooking(slotId, userId);
        return ResponseEntity.ok().build();
    }
}
