package com.sms.studentTracker.dto.response;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ErrorResponseDto {
    private boolean success;
    private int status;
    private String msg;
}

