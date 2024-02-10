package com.sms.studentTracker.dto.request;

import lombok.*;

import java.io.File;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SubmitBankSlipReqDTO {

    private String depositDate;
    private File file;
}
