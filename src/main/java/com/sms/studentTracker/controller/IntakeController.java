package com.sms.studentTracker.controller;

import com.sms.studentTracker.dto.IntakeDTO;
import com.sms.studentTracker.dto.ModuleDTO;
import com.sms.studentTracker.dto.request.ManageIntakeDTO;
import com.sms.studentTracker.dto.request.ManageModuleDTO;
import com.sms.studentTracker.dto.response.CommonResponseDTO;
import com.sms.studentTracker.service.IntakeService;
import com.sms.studentTracker.service.ModuleService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@Log4j2
@RequestMapping("/intake")
public class IntakeController {

    private IntakeService intakeService;

    public IntakeController(IntakeService intakeService) {
        this.intakeService = intakeService;
    }

    @PostMapping("/save")
    public ResponseEntity saveIntake(@RequestBody ManageIntakeDTO manageIntakeDTO){
        IntakeDTO intakeDTO = intakeService.saveIntake(manageIntakeDTO);
        CommonResponseDTO commonResponseDTO = new CommonResponseDTO(true,"Intake saved successfully", intakeDTO);
        return new ResponseEntity<>(commonResponseDTO, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity getIntake(){
        List<IntakeDTO> intakeDTO = intakeService.getIntake();
        CommonResponseDTO commonResponseDTO = new CommonResponseDTO(true,"Get all intakes", intakeDTO);
        return new ResponseEntity<>(commonResponseDTO, HttpStatus.OK);
    }

}
