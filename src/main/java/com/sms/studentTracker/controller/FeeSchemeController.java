package com.sms.studentTracker.controller;

import com.sms.studentTracker.dto.FeeSchemeBodyDTO;
import com.sms.studentTracker.dto.request.ManageFeeSchemeDTO;
import com.sms.studentTracker.dto.response.CommonResponseDTO;
import com.sms.studentTracker.service.FeeSchemeService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Log4j2
@RequestMapping("/feeScheme")
public class FeeSchemeController {

    private FeeSchemeService feeSchemeService;

    public FeeSchemeController(FeeSchemeService feeSchemeService) {
        this.feeSchemeService = feeSchemeService;
    }

    @GetMapping
    public ResponseEntity listFeeScheme(){
        return new ResponseEntity<>("Hello", HttpStatus.OK);
    }

    @PostMapping("/save")
    public ResponseEntity saveFeeScheme(@RequestBody ManageFeeSchemeDTO manageFeeSchemeDTO){
        FeeSchemeBodyDTO feeSchemeBodyDTO = feeSchemeService.saveFeeScheme(manageFeeSchemeDTO);
        CommonResponseDTO commonResponseDTO = new CommonResponseDTO(true,"Fee scheme saved successfully", feeSchemeBodyDTO);
        return new ResponseEntity<>(commonResponseDTO, HttpStatus.OK);
    }

}
