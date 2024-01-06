package com.sms.studentTracker.dto;

import com.sms.studentTracker.enums.ProgrammeStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ProgrammeDTO {

    private long programmeId;
    private String programmeName;
    private String programmeDesc;
    private ProgrammeStatus programmeStatus;

}
