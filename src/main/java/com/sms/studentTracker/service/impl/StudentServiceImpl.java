package com.sms.studentTracker.service.impl;

import com.sms.studentTracker.dto.StudentDTO;
import com.sms.studentTracker.dto.UserDTO;
import com.sms.studentTracker.dto.request.AddUserRequestDTO;
import com.sms.studentTracker.dto.request.InquiryRequestDTO;
import com.sms.studentTracker.entity.StudentEntity;
import com.sms.studentTracker.entity.UserEntity;
import com.sms.studentTracker.enums.Role;
import com.sms.studentTracker.enums.UserStatus;
import com.sms.studentTracker.repository.StudentRepository;
import com.sms.studentTracker.repository.UserRepository;
import com.sms.studentTracker.service.InquiryService;
import com.sms.studentTracker.service.StudentService;
import com.sms.studentTracker.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final ModelMapper modelMapper;


    @Override
    public StudentDTO saveStudent(StudentDTO studentDTO) {
        try{
            log.info("Start function saveStudent : {}", studentDTO);

            StudentEntity studentEntity = modelMapper.map(studentDTO, StudentEntity.class);
            StudentEntity entity = studentRepository.save(studentEntity);
            studentDTO.setStudentId(entity.getStudentId());
            return studentDTO;
        } catch (Exception e) {
            log.error("Method saveStudent : " + e.getMessage(), e);
            throw e;
        }
    }
}
