package com.sms.studentTracker.dto;

import com.sms.studentTracker.enums.FeeType;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PaymentStructureDTO {
    private long paymentStructureId;
    private long paymentPlanId;
    private FeeType feeType;
    private BigDecimal amount;
    private Date dueDate;
    private String desc;
//    private discount
}
