package com.sms.studentTracker.repository;

import com.sms.studentTracker.entity.StudentBatchEntity;
import com.sms.studentTracker.entity.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentBatchRepository extends JpaRepository<StudentBatchEntity, Long> {


}