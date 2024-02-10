package com.sms.studentTracker.service;


import com.sms.studentTracker.dto.request.SubmitBankSlipReqDTO;

public interface PaymentService {

    boolean uploadBankSlip(SubmitBankSlipReqDTO dto);

}
