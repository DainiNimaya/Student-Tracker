package com.sms.studentTracker.repository;

import com.sms.studentTracker.dto.CourseDTO;
import com.sms.studentTracker.entity.CourseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<CourseEntity, Long> {

    @Query(value = "SELECT new com.sms.studentTracker.dto.CourseDTO(ss.courseId, ss.courseName) " +
            "FROM CourseEntity ss ")
    List<CourseDTO> getCourse();

    Optional<CourseEntity> findByCourseId(long courseId);
}
