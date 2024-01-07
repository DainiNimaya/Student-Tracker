package com.sms.studentTracker.entity;

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
@Table(name = "intake")
public class IntakeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long intakeId;

    @Column(length = 255)
    private String intakeName;
}
