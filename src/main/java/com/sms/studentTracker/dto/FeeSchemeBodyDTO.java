package com.sms.studentTracker.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class FeeSchemeBodyDTO {

    private long feeSchemeId;
    private String feeScheme;
    private String desc;
    private List<PaymentPlanDTO> paymentPlanDTOS;

}
