package com.sms.studentTracker.controller;

import com.sms.studentTracker.dto.ModuleDTO;
import com.sms.studentTracker.dto.ProgrammeDTO;
import com.sms.studentTracker.dto.request.ManageModuleDTO;
import com.sms.studentTracker.dto.request.ManageProgrammeDTO;
import com.sms.studentTracker.dto.request.SubmitBankSlipReqDTO;
import com.sms.studentTracker.dto.response.CommonResponseDTO;
import com.sms.studentTracker.service.ModuleService;
import com.sms.studentTracker.service.PaymentService;
import com.sms.studentTracker.service.ProgrammeService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Log4j2
@RequestMapping("/payment")
public class PaymentController {

    private PaymentService paymentService;

    public PaymentController(ModuleService moduleService) {
        this.paymentService = paymentService;
    }

    @PostMapping(value = "/bank-slip", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity uploadBankSlip(@ModelAttribute SubmitBankSlipReqDTO dto) {
        boolean b = paymentService.uploadBankSlip(dto);
        CommonResponseDTO commonResponseDTO = new CommonResponseDTO(true,"Bank slip saved successfully",null);
        return new ResponseEntity<>(commonResponseDTO, HttpStatus.OK);
    }


}
