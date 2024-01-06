package com.sms.studentTracker.service.impl;

import com.sms.studentTracker.dto.ProgrammeDTO;
import com.sms.studentTracker.dto.request.ManageProgrammeDTO;
import com.sms.studentTracker.entity.ProgrammeEntity;
import com.sms.studentTracker.repository.ProgrammeRepository;
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
public class ProgrammeServiceImpl implements ProgrammeService {

    private final ProgrammeRepository programmeRepository;
    private final ModelMapper modelMapper;

    @Override
    public ProgrammeDTO saveProgramme(ManageProgrammeDTO manageProgrammeDTO) {
        log.info("Start function saveProgramme : {}", manageProgrammeDTO);

        ProgrammeEntity programmeEntity = new ProgrammeEntity();
        programmeEntity.setProgrammeName(manageProgrammeDTO.getProgrammeName());
        programmeEntity.setProgrammeDesc(manageProgrammeDTO.getProgrammeDesc());
        programmeEntity.setProgrammeStatus(manageProgrammeDTO.getProgrammeStatus());

        programmeRepository.save(programmeEntity);

        ProgrammeDTO programmeDTO = modelMapper.map(programmeEntity, ProgrammeDTO.class);
        return programmeDTO;

    }
}
