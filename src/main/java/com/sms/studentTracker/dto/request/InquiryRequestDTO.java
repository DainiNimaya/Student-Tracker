package com.sms.studentTracker.dto.request;

import com.sms.studentTracker.enums.InquiryType;

import java.util.Date;

public class InquiryRequestDTO {
    private String name;
    private String mobile;
    private InquiryType type;
    private long userId;
    private long courseId;
    private String remark;
    private String email;
    private long intakeId;
    private long batchId;
    private Date addedDate;
}
