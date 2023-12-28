package com.sms.studentTracker.dto;

import com.sms.studentTracker.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserDTO {

    private long id;
    private String firstName;
    private String lastName;
    private String email;
    private String mobileNumber;
    private String password;
    private Role userRole;
//    private UserType userType;
//    private AccountDTO account;
}
