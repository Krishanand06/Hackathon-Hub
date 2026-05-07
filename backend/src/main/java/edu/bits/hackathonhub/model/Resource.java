package edu.bits.hackathonhub.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "resources")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private String type; // e.g., DOCUMENT, VIDEO, LINK, DATASET, TEMPLATE

    @ElementCollection
    private Set<String> tags;
}
