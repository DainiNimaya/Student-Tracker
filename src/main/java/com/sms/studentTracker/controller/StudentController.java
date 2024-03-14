package com.sms.studentTracker.controller;


import com.sms.studentTracker.dto.StudentDTO;
import com.sms.studentTracker.dto.request.ManageStudentDTO;
import com.sms.studentTracker.dto.response.CommonResponseDTO;
import com.sms.studentTracker.service.StudentService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/{studentId}/course/{courseId}/share-course-details")
    public ResponseEntity shareStudentCourseDetail(@PathVariable("studentId") long studentId, @PathVariable("courseId") long courseId){
        boolean result = studentService.shareStudentCourseDetail(studentId, courseId);
        CommonResponseDTO commonResponseDTO = new CommonResponseDTO(true,"Share course details successfully", null);
        return new ResponseEntity<>(commonResponseDTO, HttpStatus.OK);
    }

    @GetMapping("/{studentId}/share-offer-letter")
    public ResponseEntity shareStudentOfferLetter(@PathVariable("studentId") long studentId){
        boolean result = studentService.shareStudentOfferLetter(studentId);
        CommonResponseDTO commonResponseDTO = new CommonResponseDTO(true,"Share offer letter successfully", null);
        return new ResponseEntity<>(commonResponseDTO, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity getStudentDetails(){
        List<StudentDTO> students = studentService.getStudents();
        CommonResponseDTO commonResponseDTO = new CommonResponseDTO(true,"Get student details successfully", students);
        return new ResponseEntity<>(commonResponseDTO, HttpStatus.OK);
    }

//    @GetMapping
//    public ResponseEntity getStudentEducationDetails(){
//        List<StudentDTO> students = studentService.getStudents();
//        CommonResponseDTO commonResponseDTO = new CommonResponseDTO(true,"Get student details successfully", students);
//        return new ResponseEntity<>(commonResponseDTO, HttpStatus.OK);
//    }
//
//    @GetMapping
//    public ResponseEntity getStudentWorkDetails(){
//        List<StudentDTO> students = studentService.getStudents();
//        CommonResponseDTO commonResponseDTO = new CommonResponseDTO(true,"Get student details successfully", students);
//        return new ResponseEntity<>(commonResponseDTO, HttpStatus.OK);
//    }
}
