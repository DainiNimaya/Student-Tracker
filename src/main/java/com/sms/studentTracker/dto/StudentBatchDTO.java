package com.sms.studentTracker.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class StudentBatchDTO {
    private long studentBatchId;
    private long studentId;
    private long batchId;
}
