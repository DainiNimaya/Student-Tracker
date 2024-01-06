package com.sms.studentTracker.service.impl;

import com.sms.studentTracker.dto.ModuleDTO;
import com.sms.studentTracker.dto.ProgrammeDTO;
import com.sms.studentTracker.dto.request.ManageModuleDTO;
import com.sms.studentTracker.dto.request.ManageProgrammeDTO;
import com.sms.studentTracker.entity.ModuleEntity;
import com.sms.studentTracker.entity.ProgrammeEntity;
import com.sms.studentTracker.repository.ModuleRepository;
import com.sms.studentTracker.repository.ProgrammeRepository;
import com.sms.studentTracker.service.ModuleService;
import com.sms.studentTracker.service.ProgrammeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
public class ModuleServiceImpl implements ModuleService {

    private final ModuleRepository moduleRepository;
    private final ModelMapper modelMapper;

    @Override
    public ModuleDTO saveModule(ManageModuleDTO manageModuleDTO) {
        log.info("Start function saveModule : {}", manageModuleDTO);

        ModuleEntity moduleEntity = new ModuleEntity();
        moduleEntity.setModuleName(manageModuleDTO.getModuleName());
        moduleEntity.setModuleCode(manageModuleDTO.getModuleCode());
        moduleEntity.setModuleDesc(manageModuleDTO.getModuleDesc());
        moduleEntity.setNoOfCredits(manageModuleDTO.getNoOfCredits());
        moduleEntity.setModuleType(manageModuleDTO.getModuleType());

        moduleRepository.save(moduleEntity);

        ModuleDTO moduleDTO = modelMapper.map(moduleEntity, ModuleDTO.class);
        return moduleDTO;

    }
}
