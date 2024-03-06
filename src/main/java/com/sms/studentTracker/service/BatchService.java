package com.sms.studentTracker.service;

import com.sms.studentTracker.dto.BatchDTO;
import com.sms.studentTracker.dto.request.ManageBatchDTO;

import java.util.List;

public interface BatchService {

    BatchDTO saveBatch(ManageBatchDTO manageBatchDTO);

    List<BatchDTO> getBatch(String intakeId);
}
