package com.sms.studentTracker.service.impl;

import com.sms.studentTracker.dto.BatchDTO;
import com.sms.studentTracker.dto.IntakeDTO;
import com.sms.studentTracker.dto.request.ManageBatchDTO;
import com.sms.studentTracker.dto.request.ManageIntakeDTO;
import com.sms.studentTracker.dto.response.CommonResponseDTO;
import com.sms.studentTracker.entity.BatchEntity;
import com.sms.studentTracker.entity.IntakeEntity;
import com.sms.studentTracker.exception.CustomException;
import com.sms.studentTracker.repository.BatchRepository;
import com.sms.studentTracker.repository.IntakeRepository;
import com.sms.studentTracker.service.BatchService;
import com.sms.studentTracker.service.IntakeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
public class BatchServiceImpl implements BatchService {

    private final BatchRepository batchRepository;
    private final IntakeRepository intakeRepository;
    private final ModelMapper modelMapper;

    @Override
    public BatchDTO saveBatch(ManageBatchDTO manageBatchDTO) {
        log.info("Start function saveBatch : {}", manageBatchDTO);

        try {
            Optional<IntakeEntity> intakeEntity = intakeRepository.findById(manageBatchDTO.getIntakeId());

            if(intakeEntity.isPresent()){
                BatchEntity batchEntity = new BatchEntity();
                batchEntity.setIntakeEntity(intakeEntity.get());
                batchEntity.setBatchCode(manageBatchDTO.getBatchCode());
                batchEntity.setBatchName(manageBatchDTO.getBatchName());
                batchEntity.setStartDate(manageBatchDTO.getStartDate());
                batchEntity.setEndDate(manageBatchDTO.getEndDate());
                batchEntity.setCapacity(manageBatchDTO.getCapacity());
                batchEntity.setOrientationDate(manageBatchDTO.getOrientationDate());

                batchRepository.save(batchEntity);

                BatchDTO batchDTO = modelMapper.map(batchEntity, BatchDTO.class);
                return batchDTO;
            } else {
                throw new CustomException(1,"Intake not found");
            }
        } catch (Exception e) {
            log.error("Method saveBatch : " + e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public List<BatchDTO> getBatch(String intakeId) {
        System.out.println(intakeId);
        List<BatchDTO> dto = batchRepository.getBatch(intakeId);
        return dto;
    }
}
