package com.sms.studentTracker.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.sms.studentTracker.dto.UserDTO;
import com.sms.studentTracker.dto.request.AddUserRequestDTO;
import com.sms.studentTracker.entity.UserEntity;

public interface UserService {
//    UserDTO getUserDetailsForLogin(String email);
//
    UserDTO saveUser(AddUserRequestDTO addNewUserRequestDTO);

    UserDTO getUserDetailsByUserEmail(String userEmail);
}
