package com.sms.studentTracker.dto.request;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ManageBatchDTO {

    private long intakeId;
    private String batchCode;
    private String batchName;
    private Date startDate;
    private Date endDate;
    private int capacity;
    private Date orientationDate;
}
