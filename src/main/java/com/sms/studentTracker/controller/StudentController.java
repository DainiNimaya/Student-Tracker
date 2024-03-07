package com.sms.studentTracker.controller;


import com.sms.studentTracker.dto.StudentDTO;
import com.sms.studentTracker.dto.request.ManageStudentDTO;
import com.sms.studentTracker.dto.response.CommonResponseDTO;
import com.sms.studentTracker.service.StudentService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@Log4j2
@RequestMapping("/student")
public class StudentController {

    private StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PatchMapping("/update")
    public ResponseEntity updateUser(@RequestBody ManageStudentDTO manageStudentDTO){
        boolean result = studentService.updateStudent(manageStudentDTO);
        CommonResponseDTO commonResponseDTO = new CommonResponseDTO(true,"Student details updated successfully", null);
        return new ResponseEntity<>(commonResponseDTO, HttpStatus.OK);
    }
}
