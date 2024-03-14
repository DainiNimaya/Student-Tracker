package com.sms.studentTracker.dto;

import com.sms.studentTracker.enums.Gender;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
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

    public StudentDTO(long studentId, String fullName, String preferedName, String email, String countryOfBirth, String nationality, String applyingCountry, String address, String mobile1, String mobile2, Gender gender, String statement, String paymentDoneBy, boolean isDiabled, String disabledDesc, boolean isCriminalConviction) {
        this.studentId = studentId;
//        this.userId = userId;
        this.fullName = fullName;
        this.preferedName = preferedName;
        this.email = email;
        this.countryOfBirth = countryOfBirth;
        this.nationality = nationality;
        this.applyingCountry = applyingCountry;
        this.address = address;
        this.mobile1 = mobile1;
        this.mobile2 = mobile2;
        this.gender = gender;
        this.statement = statement;
        this.paymentDoneBy = paymentDoneBy;
        this.isDiabled = isDiabled;
        this.disabledDesc = disabledDesc;
        this.isCriminalConviction = isCriminalConviction;
    }
}
