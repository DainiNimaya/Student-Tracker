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
@Table(name = "studentCourse")
public class StudentCourseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long studentCourseId;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "student_id", unique = true, nullable = false)
    private StudentEntity studentEntity;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "course_id", unique = true, nullable = false)
    private CourseEntity courseEntity;
}
