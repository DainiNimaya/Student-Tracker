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
@Table(name = "educationQualification")
public class EQualificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long eduId;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "student_id", unique = true, nullable = false)
    private StudentEntity studentEntity;

    @Column(length = 255)
    private String instituteName;

    @Column(length = 255)
    private String qualification;

    @Column(length = 255)
    private String description;

    @Column
    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss")
    private Date startDate;

    @Column
    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss")
    private Date endDate;

}
