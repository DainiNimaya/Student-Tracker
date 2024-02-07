package com.sms.studentTracker.dto.request;

import com.sms.studentTracker.enums.FeeType;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ManagePaymentStructureDTO {

    private FeeType feeType;
    private BigDecimal amount;
    private Date dueDate;
    private String structureDesc;
//    private discount
}
