package com.sms.studentTracker.service.impl;

import com.sms.studentTracker.dto.StudentDTO;
import com.sms.studentTracker.dto.UserDTO;
import com.sms.studentTracker.dto.request.AddUserRequestDTO;
import com.sms.studentTracker.dto.request.InquiryRequestDTO;
import com.sms.studentTracker.entity.*;
import com.sms.studentTracker.enums.Role;
import com.sms.studentTracker.enums.UserStatus;
import com.sms.studentTracker.repository.*;
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
public class InquiryServiceImpl implements InquiryService {

    private final UserRepository userRepository;
    private final StudentBatchRepository studentBatchRepository;
    private final StudentCourseRepository studentCourseRepository;
    private final CourseRepository courseRepository;
    private final BatchRepository batchRepository;
    private final UserService userService;
    private final StudentService studentService;
    private final ModelMapper modelMapper;


    @Override
    public boolean saveInquiry(InquiryRequestDTO inquiryRequestDTO) {
        try{
            log.info("Start function saveInquiry : {}", inquiryRequestDTO);

            Optional<UserEntity> user = userRepository.findByEmail(inquiryRequestDTO.getEmail());
            if (user.isPresent()) {
                log.error("saveInquiry() :user already exist with this mail");
                throw new UsernameNotFoundException("User already exist with this mail.");
            }

            AddUserRequestDTO addUserRequestDTO = new AddUserRequestDTO();
            addUserRequestDTO.setEmail(inquiryRequestDTO.getEmail());
            addUserRequestDTO.setFirstName(inquiryRequestDTO.getName());
            addUserRequestDTO.setMobileNumber(inquiryRequestDTO.getMobile());
            addUserRequestDTO.setStatus(UserStatus.GUEST);
            addUserRequestDTO.setUserRole(Role.GUEST);

            UserDTO userDTO =  userService.saveUser(addUserRequestDTO);

            if (userDTO == null) {
                log.error("Issue in save as a user");
                throw new UsernameNotFoundException("Can't create a user account");
            }

            StudentDTO studentDTO = new StudentDTO();
            studentDTO.setUserId(userDTO.getId());
            studentDTO.setFullName(inquiryRequestDTO.getName());
            studentDTO.setPreferedName(inquiryRequestDTO.getName());
            studentDTO.setEmail(inquiryRequestDTO.getEmail());
            studentDTO.setMobile1(inquiryRequestDTO.getMobile());

            studentDTO =  studentService.saveStudent(studentDTO);

            Optional<CourseEntity> courseEntity = courseRepository.findByCourseId(inquiryRequestDTO.getCourseId());
            if (!courseEntity.isPresent()) {
                log.error("saveInquiry() :course not found");
                throw new UsernameNotFoundException("course not found");
            }

            StudentCourseEntity studentCourseEntity = new StudentCourseEntity();
            studentCourseEntity.setStudentEntity(modelMapper.map(studentDTO, StudentEntity.class));
            studentCourseEntity.setCourseEntity(courseEntity.get());

            studentCourseRepository.save(studentCourseEntity);

            Optional<BatchEntity> batchEntity = batchRepository.findByBatchId(inquiryRequestDTO.getBatchId());
            if (!batchEntity.isPresent()) {
                log.error("saveInquiry() :batch not found");
                throw new UsernameNotFoundException("batch not found");
            }

            StudentBatchEntity studentBatchEntity = new StudentBatchEntity();
            studentBatchEntity.setStudentEntity(modelMapper.map(studentDTO, StudentEntity.class));
            studentBatchEntity.setBatchEntity(batchEntity.get());

            studentBatchRepository.save(studentBatchEntity);

            return true;

        } catch (Exception e) {
            log.error("Method saveInquiry : " + e.getMessage(), e);
            throw e;
        }
    }
}
