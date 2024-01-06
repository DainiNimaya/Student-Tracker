package com.sms.studentTracker.dto;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EQualificationDTO {

    private long studentId;
    private String instituteName;
    private String qualification;
    private Date startDate;
    private Date endDate;
    // upload doc
}
