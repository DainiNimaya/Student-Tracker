package com.sms.studentTracker.dto;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class BatchDTO {
    private long batchId;
    private long intakeId;
    private String intakeCode;
    private String intakeName;
    private Date startDate;
    private Date endDate;
    private int capacity;
    private Date orientationDate;
}
