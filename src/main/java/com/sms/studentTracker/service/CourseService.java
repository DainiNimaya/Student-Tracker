package com.sms.studentTracker.service;

import com.sms.studentTracker.dto.CourseDTO;
import com.sms.studentTracker.dto.request.ManageCourseDTO;

import java.util.List;

public interface CourseService {

    CourseDTO saveCourse(ManageCourseDTO manageCourseDTO);

    List<CourseDTO> getCourse();
}
