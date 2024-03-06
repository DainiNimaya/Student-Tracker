package com.sms.studentTracker.service.impl;

import com.sms.studentTracker.dto.IntakeDTO;
import com.sms.studentTracker.dto.request.ManageIntakeDTO;
import com.sms.studentTracker.dto.request.ManageModuleDTO;
import com.sms.studentTracker.entity.IntakeEntity;
import com.sms.studentTracker.repository.IntakeRepository;
import com.sms.studentTracker.service.IntakeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
public class IntakeServiceImpl implements IntakeService{

    private final IntakeRepository intakeRepository;
    private final ModelMapper modelMapper;

    @Override
    public IntakeDTO saveIntake(ManageIntakeDTO manageIntakeDTO) {
        try{
            log.info("Start function saveIntake : {}", manageIntakeDTO);

            IntakeEntity intakeEntity = new IntakeEntity();
            intakeEntity.setIntakeName(manageIntakeDTO.getIntakeName());

            intakeRepository.save(intakeEntity);

            IntakeDTO intakeDTO = modelMapper.map(intakeEntity, IntakeDTO.class);
            return intakeDTO;
        } catch (Exception e) {
            log.error("Method saveIntake : " + e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public List<IntakeDTO> getIntake() {
        List<IntakeDTO> dto = intakeRepository.getIntake();
        return dto;
    }
}
