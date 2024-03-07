package com.sms.studentTracker.dto;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class WorkDTO {

    private long workId;
    private long studentId;
    private String companyName;
    private String address;
    private String position;
    private String description;
    private Date startDate;
    private Date endDate;

}
