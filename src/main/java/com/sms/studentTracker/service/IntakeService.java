package com.sms.studentTracker.service;

import com.sms.studentTracker.dto.IntakeDTO;
import com.sms.studentTracker.dto.ModuleDTO;
import com.sms.studentTracker.dto.request.ManageIntakeDTO;
import com.sms.studentTracker.dto.request.ManageModuleDTO;

import java.util.List;

public interface IntakeService {

    IntakeDTO saveIntake(ManageIntakeDTO manageIntakeDTO);

    List<IntakeDTO> getIntake();
}
