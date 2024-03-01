package com.sms.studentTracker.controller;

import com.sms.studentTracker.dto.ModuleDTO;
import com.sms.studentTracker.dto.ProgrammeDTO;
import com.sms.studentTracker.dto.request.ManageModuleDTO;
import com.sms.studentTracker.dto.request.ManageProgrammeDTO;
import com.sms.studentTracker.dto.response.CommonResponseDTO;
import com.sms.studentTracker.service.ModuleService;
import com.sms.studentTracker.service.ProgrammeService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@Log4j2
@RequestMapping("/module")
public class ModuleController {

    private ModuleService moduleService;

    public ModuleController(ModuleService moduleService) {
        this.moduleService = moduleService;
    }

    @GetMapping
    public ResponseEntity listModule(){
        return new ResponseEntity<>("Hello", HttpStatus.OK);
    }

    @PostMapping("/save")
    public ResponseEntity saveModule(@RequestBody ManageModuleDTO manageModuleDTO){
        ModuleDTO moduleDTO = moduleService.saveModule(manageModuleDTO);
        CommonResponseDTO commonResponseDTO = new CommonResponseDTO(true,"Module saved successfully", moduleDTO);
        return new ResponseEntity<>(commonResponseDTO, HttpStatus.OK);
    }

}
