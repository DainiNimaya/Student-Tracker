package com.sms.studentTracker.dto;

import com.sms.studentTracker.enums.Gender;

import java.util.List;

public class StudentDTO {

    private long studentId;
    private long userId;
    private String fullName;
    private String preferedName;
    private String email;
    private String countryOfBirth;
    private String nationality;
    private String applyingCountry;
    private String address;
    private String mobile1;
    private String mobile2;
    private Gender gender;
    private String statement;
    private List<EQualificationDTO> eQualificationDTOS;
    private List<WorkDTO> workDTOS;
    private String paymentDoneBy;
    private boolean isDiabled;
    private String disabledDesc;
    private boolean isCriminalConviction;

}
