package com.sms.studentTracker.service;

import com.sms.studentTracker.dto.FeeSchemeBodyDTO;
import com.sms.studentTracker.dto.request.ManageFeeSchemeDTO;

public interface FeeSchemeService {

    FeeSchemeBodyDTO saveFeeScheme(ManageFeeSchemeDTO manageFeeSchemeDTO);
}
