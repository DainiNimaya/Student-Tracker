package com.sms.studentTracker.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "intakeFeeProgramme")
public class IntakeFeeProgEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long ifpId;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "intake_id", unique = true, nullable = false)
    private IntakeEntity intakeEntity;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "feeScheme_id", unique = true, nullable = false)
    private FeeSchemeEntity feeSchemeEntity;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "programme_id", unique = true, nullable = false)
    private ProgrammeEntity programmeEntity;

}
