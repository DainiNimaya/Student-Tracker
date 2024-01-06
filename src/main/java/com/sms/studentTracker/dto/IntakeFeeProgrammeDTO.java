package com.sms.studentTracker.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class IntakeFeeProgrammeDTO {

    private long intakeFeeProgrammeId;
    private long feeSchemeId;
    private long programmeId;
    private long intakeId;
}
