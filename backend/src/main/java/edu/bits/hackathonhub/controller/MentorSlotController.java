package edu.bits.hackathonhub.controller;

import edu.bits.hackathonhub.dto.CreateMentorSlotRequest;
import edu.bits.hackathonhub.model.MentorSlot;
import edu.bits.hackathonhub.service.MentorService;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mentor-slots")
@RequiredArgsConstructor
public class MentorSlotController {

    private final MentorService mentorService;

    @PostMapping
    public ResponseEntity<MentorSlot> createSlot(@RequestBody CreateMentorSlotRequest request) {
        return ResponseEntity.ok(mentorService.createSlot(
                request.getMentorId(),
                request.getStartTime(),
                request.getEndTime()
        ));
    }

    @PatchMapping("/{slotId}")
    public ResponseEntity<MentorSlot> updateAvailability(
            @PathVariable Long slotId,
            @RequestBody UpdateMentorSlotRequest request
    ) {
        return ResponseEntity.ok(mentorService.updateSlotAvailability(slotId, request.isAvailable()));
    }

    @Data
    public static class UpdateMentorSlotRequest {
        @JsonProperty("isAvailable")
        private boolean isAvailable;
    }
}
