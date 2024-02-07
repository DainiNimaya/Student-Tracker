package com.sms.studentTracker.service.impl;

import com.sms.studentTracker.dto.*;
import com.sms.studentTracker.dto.request.ManageBatchDTO;
import com.sms.studentTracker.dto.request.ManageFeeSchemeDTO;
import com.sms.studentTracker.dto.request.ManagePaymentPlanDTO;
import com.sms.studentTracker.dto.request.ManagePaymentStructureDTO;
import com.sms.studentTracker.entity.*;
import com.sms.studentTracker.exception.CustomException;
import com.sms.studentTracker.repository.*;
import com.sms.studentTracker.service.BatchService;
import com.sms.studentTracker.service.FeeSchemeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
public class FeeSchemeServiceImpl implements FeeSchemeService {

    private final FeeSchemeRepository feeSchemeRepository;
    private final PaymentPlanRepository paymentPlanRepository;
    private final PaymentStructureRepository paymentStructureRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
    public FeeSchemeBodyDTO saveFeeScheme(ManageFeeSchemeDTO manageFeeSchemeDTO) {
        log.info("Start function saveFeeScheme : {}", manageFeeSchemeDTO);

        try {

            FeeSchemeEntity feeSchemeEntity = new FeeSchemeEntity();
            feeSchemeEntity.setFeeScheme(manageFeeSchemeDTO.getFeeSchemeName());
            feeSchemeEntity.setFeeDesc(manageFeeSchemeDTO.getFeeDesc());

            feeSchemeRepository.save(feeSchemeEntity);
            FeeSchemeDTO feeSchemeDTO = modelMapper.map(feeSchemeEntity, FeeSchemeDTO.class);
            feeSchemeEntity.setFeeSchemeId(feeSchemeDTO.getFeeSchemeId());

            FeeSchemeBodyDTO feeSchemeBodyDTO = new FeeSchemeBodyDTO();
            feeSchemeBodyDTO.setFeeSchemeId(feeSchemeDTO.getFeeSchemeId());
            feeSchemeBodyDTO.setFeeScheme(feeSchemeDTO.getFeeScheme());
            feeSchemeBodyDTO.setDesc(feeSchemeDTO.getDesc());

            if(!manageFeeSchemeDTO.getPlanDTOS().isEmpty()){
                List<PaymentPlanDTO> paymentPlanList = new ArrayList<>();
                for (ManagePaymentPlanDTO pp : manageFeeSchemeDTO.getPlanDTOS()) {
                    PaymentPlanEntity planEntity = new PaymentPlanEntity();
                    planEntity.setPlanName(pp.getPlanName());
                    planEntity.setFeeSchemeEntity(feeSchemeEntity);
                    planEntity.setInterval(pp.getInterval());

                    paymentPlanRepository.save(planEntity);
                    PaymentPlanDTO paymentPlanDTO = modelMapper.map(planEntity, PaymentPlanDTO.class);
                    planEntity.setPaymentPlanId(paymentPlanDTO.getPaymentPlanId());

                    if(!pp.getPaymentStructureDTOS().isEmpty()){
                        List<PaymentStructureDTO> paymentStructureList = new ArrayList<>();
                        for (ManagePaymentStructureDTO ps : pp.getPaymentStructureDTOS()) {
                            PaymentStructureEntity paymentStructureEntity = new PaymentStructureEntity();
                            paymentStructureEntity.setFeeType(ps.getFeeType());
                            paymentStructureEntity.setPaymentPlanEntity(planEntity);
                            paymentStructureEntity.setAmount(ps.getAmount());
                            paymentStructureEntity.setDueDate(ps.getDueDate());

                            paymentStructureRepository.save(paymentStructureEntity);
                            PaymentStructureDTO paymentStructureDTO = modelMapper.map(paymentStructureEntity, PaymentStructureDTO.class);
                            paymentStructureEntity.setPaymentStructureId(paymentStructureDTO.getPaymentStructureId());

                            paymentStructureList.add(paymentStructureDTO);
                        }
                        paymentPlanDTO.setPaymentStructureDTOS(paymentStructureList);
                    }
                    paymentPlanList.add(paymentPlanDTO);
                }
                feeSchemeBodyDTO.setPaymentPlanDTOS(paymentPlanList);
            }

            return feeSchemeBodyDTO;

        } catch (Exception e) {
            log.error("Method saveFeeScheme : " + e.getMessage(), e);
            throw e;
        }
    }
}
