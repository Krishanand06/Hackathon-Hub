package edu.bits.hackathonhub.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Set;

@Entity
@Table(name = "mentors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Mentor {

    @Id
    @Column(name = "mentor_id")
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String company;
    private String designation;
    private Double rating;
    
    @Column(name = "total_sessions")
    private Integer totalSessions;
    
    @Column(name = "is_active")
    private boolean isActive;

    @ElementCollection
    @CollectionTable(name = "mentor_expertise", joinColumns = @JoinColumn(name = "mentor_id"))
    @Column(name = "skill_id")
    private Set<Long> expertiseSkillIds;

    @OneToMany(mappedBy = "mentorId")
    private List<MentorSlot> availableSlots;
}
