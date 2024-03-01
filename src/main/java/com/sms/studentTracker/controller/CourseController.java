package com.sms.studentTracker.controller;

import com.sms.studentTracker.dto.CourseDTO;
import com.sms.studentTracker.dto.request.ManageCourseDTO;
import com.sms.studentTracker.dto.response.CommonResponseDTO;
import com.sms.studentTracker.service.CourseService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@Log4j2
@RequestMapping("/course")
public class CourseController {

    private CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity listCourse(){
        return new ResponseEntity<>("Hello", HttpStatus.OK);
    }

    @PostMapping("/save")
    public ResponseEntity saveCourse(@RequestBody ManageCourseDTO manageCourseDTO){
        CourseDTO courseDTO = courseService.saveCourse(manageCourseDTO);
        CommonResponseDTO commonResponseDTO = new CommonResponseDTO(true,"Course saved successfully", courseDTO);
        return new ResponseEntity<>(commonResponseDTO, HttpStatus.OK);
    }

}
