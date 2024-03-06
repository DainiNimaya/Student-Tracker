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
    private String batchCode;
    private String batchName;
    private Date startDate;
    private Date endDate;
    private int capacity;
    private Date orientationDate;

    public BatchDTO(long batchId, String batchName) {
        this.batchId = batchId;
        this.batchName = batchName;
    }
}
