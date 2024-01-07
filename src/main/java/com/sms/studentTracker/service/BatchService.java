package com.sms.studentTracker.service;

import com.sms.studentTracker.dto.BatchDTO;
import com.sms.studentTracker.dto.request.ManageBatchDTO;

public interface BatchService {

    BatchDTO saveBatch(ManageBatchDTO manageBatchDTO);
}
