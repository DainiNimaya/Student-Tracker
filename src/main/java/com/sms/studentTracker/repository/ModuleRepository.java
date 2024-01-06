package com.sms.studentTracker.repository;

import com.sms.studentTracker.entity.ModuleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModuleRepository extends JpaRepository<ModuleEntity, Long> {

}
