package com.sms.studentTracker.repository;

import com.sms.studentTracker.entity.BatchEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BatchRepository extends JpaRepository<BatchEntity, Long> {

}
