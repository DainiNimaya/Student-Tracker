package com.sms.studentTracker.dto.request;

import com.sms.studentTracker.enums.ModuleType;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ManageModuleDTO {

    private String moduleCode;
    private String moduleDesc;
    private String moduleName;
    private int noOfCredits;
    private ModuleType moduleType;
    private Long[] lecturers;
}
