package edu.bits.hackathonhub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateMentorSlotRequest {
    private Long mentorId;
    private String startTime;
    private String endTime;
}
