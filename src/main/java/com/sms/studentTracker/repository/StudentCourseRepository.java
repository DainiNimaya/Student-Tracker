package com.sms.studentTracker.repository;

import com.sms.studentTracker.entity.StudentCourseEntity;
import com.sms.studentTracker.entity.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentCourseRepository extends JpaRepository<StudentCourseEntity, Long> {


}