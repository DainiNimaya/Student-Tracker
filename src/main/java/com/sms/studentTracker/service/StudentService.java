package com.sms.studentTracker.service;

import com.sms.studentTracker.dto.StudentDTO;
import com.sms.studentTracker.dto.request.ManageStudentDTO;
import com.sms.studentTracker.entity.StudentEntity;

import java.util.List;

public interface StudentService {

    StudentEntity saveStudent(StudentEntity entity);

    boolean updateStudent(ManageStudentDTO studentDTO);

    boolean shareStudentCourseDetail(long studentId, long courseId);

    boolean shareStudentOfferLetter(long studentId);

    List<StudentDTO> getStudents();

}
