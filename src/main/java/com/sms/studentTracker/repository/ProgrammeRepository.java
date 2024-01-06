package com.sms.studentTracker.repository;

import com.sms.studentTracker.entity.ProgrammeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgrammeRepository extends JpaRepository<ProgrammeEntity, Long> {

}
