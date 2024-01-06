package com.sms.studentTracker.service;

import com.sms.studentTracker.dto.ProgrammeDTO;
import com.sms.studentTracker.dto.request.ManageProgrammeDTO;

public interface ProgrammeService {

    ProgrammeDTO saveProgramme(ManageProgrammeDTO manageProgrammeDTO);
}
