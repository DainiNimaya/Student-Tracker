package com.sms.studentTracker.exception;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class CustomException extends RuntimeException{
    private int status;
    private String message;

    public CustomException(int status,String message) {
        super(message);
        this.status = status;
        this.message = message;
    }


}
