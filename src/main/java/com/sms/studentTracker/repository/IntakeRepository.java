package com.sms.studentTracker.repository;

import com.sms.studentTracker.dto.IntakeDTO;
import com.sms.studentTracker.entity.IntakeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IntakeRepository extends JpaRepository<IntakeEntity, Long> {

    @Query(value = "SELECT new com.sms.studentTracker.dto.IntakeDTO(ss.intakeId, ss.intakeName) " +
            "FROM IntakeEntity ss ")
    List<IntakeDTO> getIntake();

}
