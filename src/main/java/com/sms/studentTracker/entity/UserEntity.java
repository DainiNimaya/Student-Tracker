package com.sms.studentTracker.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.sms.studentTracker.enums.Role;
import com.sms.studentTracker.enums.UserStatus;
import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user")

public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(length = 255)
    private String firstName;
    @Column(length = 255)
    private String lastName;
    @Column(length = 255, unique = true, nullable = false)
    private String email;
    @Column(length = 255)
    private String mobileNumber;
    @Column(length = 255, nullable = false)
    private String password;
    @Enumerated(EnumType.STRING)
    private Role userRole;
    @Column(length = 255)
    private String gender;
    @Column
    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss")
    private Date dob;
    @Column(length = 255)
    private String nic;
    @Enumerated(EnumType.STRING)
    private UserStatus status;


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getUserRole() {
        return userRole;
    }

    public void setUserRole(Role userRole) {
        this.userRole = userRole;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Date getDob() {
        return dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }
}
