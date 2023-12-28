package com.sms.studentTracker.dto.request;

import com.sms.studentTracker.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AddUserRequestDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String mobileNumber;
    private String password;
    private Role userRole;
}