package edu.bits.hackathonhub.repository;

import edu.bits.hackathonhub.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
}
