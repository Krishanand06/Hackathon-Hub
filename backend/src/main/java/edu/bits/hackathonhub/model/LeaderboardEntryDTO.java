package edu.bits.hackathonhub.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LeaderboardEntryDTO {
    private Long id;
    private Integer rank;
    private String teamName;
    private String projectTitle;
    private Double totalScore;
    private String trend;
    private Long submissionId;
    private java.util.List<String> members;
}
