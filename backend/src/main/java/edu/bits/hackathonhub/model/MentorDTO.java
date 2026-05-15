package edu.bits.hackathonhub.model;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class MentorDTO {
    private Long id;
    private String fullName;
    private List<String> expertise;
    private String company;
    private String designation;
    private Double rating;
    private Integer totalSessions;
    private String bio;
    private List<MentorSlot> availableSlots;
}
