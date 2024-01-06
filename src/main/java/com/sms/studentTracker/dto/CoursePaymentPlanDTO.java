package com.sms.studentTracker.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CoursePaymentPlanDTO {
    private long coursePaymentPlanId;
    private long courseId;
    private long paymentPlanId;
}
