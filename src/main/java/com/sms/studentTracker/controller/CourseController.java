package com.sms.studentTracker.controller;

import com.sms.studentTracker.dto.CourseDTO;
import com.sms.studentTracker.dto.request.ManageCourseDTO;
import com.sms.studentTracker.dto.response.CommonResponseDTO;
import com.sms.studentTracker.service.CourseService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@Log4j2
@RequestMapping("/course")
public class CourseController {

    private CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }


    @PostMapping("/save")
    public ResponseEntity saveCourse(@RequestBody ManageCourseDTO manageCourseDTO){
        CourseDTO courseDTO = courseService.saveCourse(manageCourseDTO);
        CommonResponseDTO commonResponseDTO = new CommonResponseDTO(true,"Course saved successfully", courseDTO);
        return new ResponseEntity<>(commonResponseDTO, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity getCourse(){
        List<CourseDTO> courseDTOS = courseService.getCourse();
        CommonResponseDTO commonResponseDTO = new CommonResponseDTO(true,"Get all courses", courseDTOS);
        return new ResponseEntity<>(commonResponseDTO, HttpStatus.OK);
    }
}
