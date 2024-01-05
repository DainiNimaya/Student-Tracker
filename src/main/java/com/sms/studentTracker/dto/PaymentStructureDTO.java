package com.sms.studentTracker.dto;

import com.sms.studentTracker.enums.FeeType;

import java.math.BigDecimal;
import java.util.Date;

public class PaymentStructureDTO {
    private long paymentStructureId;
    private long paymentPlanId;
    private FeeType feeType;
    private BigDecimal amount;
    private Date dueDate;
    private String desc;
//    private discount
}
