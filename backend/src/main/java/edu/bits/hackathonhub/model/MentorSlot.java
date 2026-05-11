package edu.bits.hackathonhub.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "mentor_slots")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "slot_id")
    private Long id;

    @Column(name = "mentor_id", nullable = false)
    private Long mentorId;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SlotStatus status;

    @ManyToOne
    @JoinColumn(name = "booked_by_user_id")
    private User bookedBy;

    public boolean isBooked() {
        return status == SlotStatus.BOOKED;
    }

    public void setBooked(boolean booked) {
        this.status = booked ? SlotStatus.BOOKED : SlotStatus.AVAILABLE;
    }

    public enum SlotStatus {
        AVAILABLE,
        BOOKED,
        CANCELLED
    }
}
