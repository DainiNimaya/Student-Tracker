package com.sms.studentTracker.dto.request;

import com.sms.studentTracker.enums.ProgrammeStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ManageProgrammeDTO {

    private String programmeName;
    private String programmeDesc;
    private ProgrammeStatus programmeStatus;

}
