package com.sms.studentTracker.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class LectureModuleDTO {

    private long lectureModuleId;
    private long userId;
    private long moduleId;
}
