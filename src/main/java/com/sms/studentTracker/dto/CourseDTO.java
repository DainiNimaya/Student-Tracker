package com.sms.studentTracker.dto;

import com.sms.studentTracker.enums.CourseType;
import com.sms.studentTracker.enums.StudyMode;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CourseDTO {

    private long courseId;
    private String courseName;
    private String courseCode;
    private String courseDesc;
    private CourseType courseType;
    private int totalCredits;
    private StudyMode studyMode;
    private long programmeId;

}
