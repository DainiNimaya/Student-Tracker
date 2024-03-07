package com.sms.studentTracker.service;

import com.sms.studentTracker.dto.StudentDTO;
import com.sms.studentTracker.dto.request.ManageStudentDTO;

public interface StudentService {

    StudentDTO saveStudent(StudentDTO studentDTO);

    boolean updateStudent(ManageStudentDTO studentDTO);

}
