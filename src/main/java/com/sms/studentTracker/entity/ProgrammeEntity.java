package com.sms.studentTracker.entity;

import com.sms.studentTracker.enums.ProgrammeStatus;
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
@Table(name = "programme")
public class ProgrammeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long programmeId;

    @Column(length = 255)
    private String programmeName;

    @Column(length = 255)
    private String programmeDesc;

    @Enumerated(EnumType.STRING)
    private ProgrammeStatus programmeStatus;
}
