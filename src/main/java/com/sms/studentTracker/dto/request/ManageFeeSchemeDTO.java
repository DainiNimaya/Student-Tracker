package com.sms.studentTracker.dto.request;

import com.sms.studentTracker.dto.PaymentStructureDTO;
import lombok.*;

import java.sql.Array;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ManageFeeSchemeDTO {

    private String feeSchemeName;
    private String feeDesc;
    private List<ManagePaymentPlanDTO> planDTOS;
}
