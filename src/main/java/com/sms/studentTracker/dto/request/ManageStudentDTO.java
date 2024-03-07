package com.sms.studentTracker.dto.request;

import com.sms.studentTracker.dto.EQualificationDTO;
import com.sms.studentTracker.dto.WorkDTO;
import com.sms.studentTracker.enums.Gender;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ManageStudentDTO {

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
