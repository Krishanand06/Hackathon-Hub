package edu.bits.hackathonhub.model;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class TeamDTO {
    private Long id;
    private String name;
    private String description;
    private Long hackathonId;
    private String hackathonTitle;
    private List<TeamMemberDTO> members;
    private Integer maxSize;
    private List<String> requiredSkills;
    private boolean isOpen;
    private Long leaderId;
    private String leaderName;
}
