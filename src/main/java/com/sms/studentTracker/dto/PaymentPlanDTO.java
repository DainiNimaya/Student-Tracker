package com.sms.studentTracker.dto;

import lombok.*;

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
}
