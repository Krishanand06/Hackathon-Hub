package edu.bits.hackathonhub.model;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class TeamMemberDTO {
    private Long id; // the user id or team member mapping id
    private Long userId;
    private String username;
    private String fullName;
    private String role;
    private List<String> skills;
    private boolean isLeader;
}
