package com.sms.studentTracker.service;


import com.sms.studentTracker.dto.request.InquiryRequestDTO;

import java.util.List;

public interface InquiryService {

    boolean saveInquiry(InquiryRequestDTO inquiryRequestDTO);

}
