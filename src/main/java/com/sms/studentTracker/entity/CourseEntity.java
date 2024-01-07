package com.sms.studentTracker.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.sms.studentTracker.enums.CourseType;
import com.sms.studentTracker.enums.StudyMode;
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
@Table(name = "course")
public class CourseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long courseId;

    @Column(length = 255)
    private String courseName;

    @Column(length = 255)
    private String courseCode;

    @Column(length = 255)
    private String courseDesc;

    @Enumerated(EnumType.STRING)
    private CourseType courseType;

    @Column
    private int totalCredits;

    @Enumerated(EnumType.STRING)
    private StudyMode studyMode;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "programme_id", unique = true, nullable = false)
    private ProgrammeEntity programmeEntity;
}
