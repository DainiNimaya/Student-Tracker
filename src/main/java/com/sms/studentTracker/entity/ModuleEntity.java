package com.sms.studentTracker.entity;

import com.sms.studentTracker.enums.ModuleType;
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
@Table(name = "module")
public class ModuleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long moduleId;

    @Column(length = 255)
    private String moduleCode;

    @Column(length = 255)
    private String moduleDesc;

    @Column(length = 255)
    private String moduleName;

    @Column(length = 255)
    private int noOfCredits;

    @Enumerated(EnumType.STRING)
    private ModuleType moduleType;
}
