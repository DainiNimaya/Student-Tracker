package com.sms.studentTracker.dto;

import com.sms.studentTracker.enums.Role;
import com.sms.studentTracker.enums.UserStatus;
import lombok.*;

import java.util.Date;

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
    private String gender;
    private Date dob;
    private String nic;
    private UserStatus status;

//    private UserType userType;
//    private AccountDTO account;
}
