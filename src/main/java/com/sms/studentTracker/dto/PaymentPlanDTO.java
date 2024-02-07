package com.sms.studentTracker.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PaymentPlanDTO {
    private long paymentPlanId;
    private long feeSchemeId;
    private String planName;
    private String interval;
    private List<PaymentStructureDTO> paymentStructureDTOS;
}
