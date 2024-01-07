package com.sms.studentTracker.service;

import com.sms.studentTracker.dto.CourseDTO;
import com.sms.studentTracker.dto.request.ManageCourseDTO;

public interface CourseService {

    CourseDTO saveCourse(ManageCourseDTO manageCourseDTO);
}
