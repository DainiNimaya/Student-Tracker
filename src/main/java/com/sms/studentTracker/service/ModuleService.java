package com.sms.studentTracker.service;

import com.sms.studentTracker.dto.ModuleDTO;
import com.sms.studentTracker.dto.request.ManageModuleDTO;

public interface ModuleService {

    ModuleDTO saveModule(ManageModuleDTO manageModuleDTO);
}
