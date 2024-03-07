package com.sms.studentTracker.repository;

import com.sms.studentTracker.entity.EQualificationEntity;
import com.sms.studentTracker.entity.WorkEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface EducationQualificationRepository extends JpaRepository<EQualificationEntity, Long> {


}