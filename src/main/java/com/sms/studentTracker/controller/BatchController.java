package com.sms.studentTracker.controller;

import com.sms.studentTracker.dto.BatchDTO;
import com.sms.studentTracker.dto.IntakeDTO;
import com.sms.studentTracker.dto.request.ManageBatchDTO;
import com.sms.studentTracker.dto.request.ManageIntakeDTO;
import com.sms.studentTracker.dto.request.ReqBatchDTO;
import com.sms.studentTracker.dto.response.CommonResponseDTO;
import com.sms.studentTracker.service.BatchService;
import com.sms.studentTracker.service.IntakeService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@Log4j2
@RequestMapping("/batch")
public class BatchController {

    private BatchService batchService;

    public BatchController(BatchService batchService) {
        this.batchService = batchService;
    }

    @PostMapping("/save")
    public ResponseEntity saveBatch(@RequestBody ManageBatchDTO manageBatchDTO){
        BatchDTO batchDTO = batchService.saveBatch(manageBatchDTO);
        CommonResponseDTO commonResponseDTO = new CommonResponseDTO(true,"Batch saved successfully", batchDTO);
        return new ResponseEntity<>(commonResponseDTO, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity getBatch(@RequestBody ReqBatchDTO reqBatchDTO){
        List<BatchDTO> batch = batchService.getBatch(reqBatchDTO.getIntakeId());
        CommonResponseDTO commonResponseDTO = new CommonResponseDTO(true,"Get all batches", batch);
        return new ResponseEntity<>(commonResponseDTO, HttpStatus.OK);
    }

}
