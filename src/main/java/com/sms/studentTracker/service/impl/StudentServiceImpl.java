package com.sms.studentTracker.service.impl;

import com.sms.studentTracker.dto.EQualificationDTO;
import com.sms.studentTracker.dto.StudentDTO;
import com.sms.studentTracker.dto.UserDTO;
import com.sms.studentTracker.dto.WorkDTO;
import com.sms.studentTracker.dto.request.AddUserRequestDTO;
import com.sms.studentTracker.dto.request.InquiryRequestDTO;
import com.sms.studentTracker.dto.request.ManageStudentDTO;
import com.sms.studentTracker.entity.EQualificationEntity;
import com.sms.studentTracker.entity.StudentEntity;
import com.sms.studentTracker.entity.UserEntity;
import com.sms.studentTracker.entity.WorkEntity;
import com.sms.studentTracker.enums.Role;
import com.sms.studentTracker.enums.UserStatus;
import com.sms.studentTracker.repository.EducationQualificationRepository;
import com.sms.studentTracker.repository.StudentRepository;
import com.sms.studentTracker.repository.UserRepository;
import com.sms.studentTracker.repository.WorkRepository;
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
    private final EducationQualificationRepository educationQualificationRepository;
    private final WorkRepository workRepository;
    private final UserRepository userRepository;
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

    @Override
    public boolean updateStudent(ManageStudentDTO studentDTO) {
        try{
            log.info("Start function updateStudent : {}", studentDTO);

            Optional<UserEntity> user = userRepository.findByEmail(studentDTO.getEmail());
            if (!user.isPresent()) {
                log.error("updateStudent() :User account not found");
                throw new UsernameNotFoundException("User account not found");
            }

            StudentEntity studentEntity = new StudentEntity();
            studentEntity.setStudentId(studentDTO.getStudentId());
            studentEntity.setUserEntity(user.get());
            studentEntity.setFullName(studentDTO.getFullName());
            studentEntity.setPreferedName(studentDTO.getPreferedName());
            studentEntity.setEmail(studentDTO.getEmail());
            studentEntity.setCountryOfBirth(studentDTO.getCountryOfBirth());
            studentEntity.setNationality(studentDTO.getNationality());
            studentEntity.setApplyingCountry(studentDTO.getApplyingCountry());
            studentEntity.setAddress(studentDTO.getAddress());
            studentEntity.setMobile1(studentDTO.getMobile1());
            studentEntity.setMobile2(studentDTO.getMobile2());
            studentEntity.setGender(studentDTO.getGender());
            studentEntity.setStatement(studentDTO.getStatement());
            studentEntity.setPaymentDoneBy(studentDTO.getPaymentDoneBy());
            studentEntity.setDiabled(studentDTO.isDiabled());
            studentEntity.setDisabledDesc(studentDTO.getDisabledDesc());
            studentEntity.setCriminalConviction(studentDTO.isCriminalConviction());

            studentRepository.save(studentEntity);

            if (!studentDTO.getEQualificationDTOS().isEmpty()) {
                for (EQualificationDTO dto: studentDTO.getEQualificationDTOS()) {
                    EQualificationEntity entity = new EQualificationEntity();
                    entity.setStudentEntity(studentEntity);
                    entity.setInstituteName(dto.getInstituteName());
                    entity.setQualification(dto.getQualification());
                    entity.setDescription(dto.getDescription());
                    entity.setStartDate(dto.getStartDate());
                    entity.setEndDate(dto.getEndDate());

                    educationQualificationRepository.save(entity);
                }
            }

            if (!studentDTO.getWorkDTOS().isEmpty()) {
                for (WorkDTO dto: studentDTO.getWorkDTOS()) {
                    WorkEntity entity = new WorkEntity();
                    entity.setStudentEntity(studentEntity);
                    entity.setCompanyName(dto.getCompanyName());
                    entity.setAddress(dto.getAddress());
                    entity.setPosition(dto.getPosition());
                    entity.setDescription(dto.getDescription());
                    entity.setStartDate(dto.getStartDate());
                    entity.setEndDate(dto.getEndDate());

                    workRepository.save(entity);
                }
            }

            return true;
        } catch (Exception e) {
            log.error("Method updateStudent : " + e.getMessage(), e);
            throw e;
        }
    }
}
