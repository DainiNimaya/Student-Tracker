package com.sms.studentTracker.dto.request;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ManagePaymentPlanDTO {
    private long paymentPlanId;
    private long feeSchemeId;
    private String planName;
    private String interval;
    private List<ManagePaymentStructureDTO> paymentStructureDTOS;
}
