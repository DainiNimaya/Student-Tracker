package com.sms.studentTracker.controller;

import com.sms.studentTracker.dto.ProgrammeDTO;
import com.sms.studentTracker.dto.request.ManageProgrammeDTO;
import com.sms.studentTracker.dto.response.CommonResponseDTO;
import com.sms.studentTracker.service.ProgrammeService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Log4j2
@RequestMapping("/programme")
public class ProgrammeController {

    private ProgrammeService programmeService;

    public ProgrammeController(ProgrammeService programmeService) {
        this.programmeService = programmeService;
    }

    @GetMapping
    public ResponseEntity listProgramme(){
        return new ResponseEntity<>("Hello", HttpStatus.OK);
    }

    @PostMapping("/save")
    public ResponseEntity saveProgramme(@RequestBody ManageProgrammeDTO manageProgrammeDTO){
        ProgrammeDTO programmeDTO = programmeService.saveProgramme(manageProgrammeDTO);
        CommonResponseDTO commonResponseDTO = new CommonResponseDTO(true,"Programme saved successfully", programmeDTO);
        return new ResponseEntity<>(commonResponseDTO, HttpStatus.OK);
    }

}
