package com.sms.studentTracker.entity;

import com.sms.studentTracker.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "student")
public class StudentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long studentId;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private UserEntity userEntity;

    @Column(length = 255)
    private String fullName;

    @Column(length = 255)
    private String preferedName;

    @Column(length = 255)
    private String email;

    @Column(length = 255)
    private String countryOfBirth;

    @Column(length = 255)
    private String nationality;

    @Column(length = 255)
    private String applyingCountry;

    @Column(length = 255)
    private String address;

    @Column(length = 255)
    private String mobile1;

    @Column(length = 255)
    private String mobile2;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(length = 255)
    private String statement;

    @Column(length = 255)
    private String paymentDoneBy;

    @Column
    private boolean isDiabled;

    @Column(length = 255)
    private String disabledDesc;

    @Column
    private boolean isCriminalConviction;


}
