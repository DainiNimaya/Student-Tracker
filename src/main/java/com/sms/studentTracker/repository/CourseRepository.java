package com.sms.studentTracker.repository;

import com.sms.studentTracker.entity.CourseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<CourseEntity, Long> {

}
