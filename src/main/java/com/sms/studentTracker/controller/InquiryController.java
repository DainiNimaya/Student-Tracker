package com.sms.studentTracker.controller;

import com.sms.studentTracker.dto.CourseDTO;
import com.sms.studentTracker.dto.request.InquiryRequestDTO;
import com.sms.studentTracker.dto.request.ManageCourseDTO;
import com.sms.studentTracker.dto.response.CommonResponseDTO;
import com.sms.studentTracker.service.CourseService;
import com.sms.studentTracker.service.InquiryService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@Log4j2
@RequestMapping("/inquiry")
public class InquiryController {

    private InquiryService inquiryService;

    public InquiryController(InquiryService inquiryService) {
        this.inquiryService = inquiryService;
    }
//
//    @GetMapping
//    public ResponseEntity listCourse(){
//        return new ResponseEntity<>("Hello", HttpStatus.OK);
//    }
//
    @PostMapping("/save")
    public ResponseEntity saveInquiry(@RequestBody InquiryRequestDTO inquiryRequestDTO){
        boolean result = inquiryService.saveInquiry(inquiryRequestDTO);
        CommonResponseDTO commonResponseDTO = new CommonResponseDTO(true,"Inquiry saved successfully", null);
        return new ResponseEntity<>(commonResponseDTO, HttpStatus.OK);
    }

}
