package com.sms.studentTracker.service.impl;

import com.sms.studentTracker.dto.EQualificationDTO;
import com.sms.studentTracker.dto.StudentDTO;
import com.sms.studentTracker.dto.UserDTO;
import com.sms.studentTracker.dto.WorkDTO;
import com.sms.studentTracker.dto.request.AddUserRequestDTO;
import com.sms.studentTracker.dto.request.InquiryRequestDTO;
import com.sms.studentTracker.dto.request.ManageStudentDTO;
import com.sms.studentTracker.entity.*;
import com.sms.studentTracker.enums.Role;
import com.sms.studentTracker.enums.UserStatus;
import com.sms.studentTracker.repository.*;
import com.sms.studentTracker.service.InquiryService;
import com.sms.studentTracker.service.StudentService;
import com.sms.studentTracker.service.UserService;
import com.sms.studentTracker.utils.EmailSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final EducationQualificationRepository educationQualificationRepository;
    private final WorkRepository workRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Autowired
    @Qualifier("emailSender")
    private EmailSender mailSender;


    @Override
    public StudentEntity saveStudent(StudentEntity entity1) {
        try{
            log.info("Start function saveStudent : {}", entity1);

            StudentEntity entity = studentRepository.save(entity1);
            return entity;
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

            UserEntity userEntity = user.get();
            userEntity.setStatus(UserStatus.ACTIVE);
            userEntity.setUserRole(Role.STUDENT);

            userRepository.save(userEntity);

            StudentEntity studentEntity = new StudentEntity();
            studentEntity.setStudentId(studentDTO.getStudentId());
            studentEntity.setUserEntity(userEntity);
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

    @Override
    public boolean shareStudentCourseDetail(long studentId, long courseId) {
        try{
            log.info("Start function shareStudentCourseDetail - student:"+ studentId + " course:"+courseId);

            Optional<StudentEntity> student = studentRepository.findByStudentId(studentId);
            if (!student.isPresent()) {
                log.error("shareStudentCourseDetail() :Student account not found");
                throw new UsernameNotFoundException("Student account not found");
            }

            Optional<CourseEntity> course = courseRepository.findByCourseId(courseId);
            if (!course.isPresent()) {
                log.error("shareStudentCourseDetail() :Course details not found");
                throw new UsernameNotFoundException("Course details not found");
            }

            Optional<UserEntity> user = userRepository.findByEmail(student.get().getEmail());

            if (user.get().getUserRole() ==  Role.STUDENT) {
//                SimpleDateFormat dateFormat = new SimpleDateFormat("MMMM dd, yyyy");
//                StringBuilder body = new StringBuilder();
//                body.append("Dear Student,\n\n");
//                body.append("We hope this message finds you well. We want to share your course details with this mail.\n\n");
//
//                body.append("\n");
//                body.append("Date: ").append(dateFormat.format(new Date())).append("\n");
//                body.append("Course details : https://studentTracker.lk/course-details/"+course.get().getCourseCode()).append("\n");
//
//                body.append("Thank you for choosing our service. If you have any questions or need further assistance, feel free to reach out.\n\n");
//                body.append("Best Regards,\nYour Service Team");
//
//                mailSender.sendEmail(student.get().getEmail(), "Course Details Doc", body.toString());
            }

            return true;
        } catch (Exception e) {
            log.error("Method shareStudentCourseDetail : " + e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public boolean shareStudentOfferLetter(long studentId) {
        try{
            log.info("Start function shareStudentOfferLetter - student:"+ studentId);

            Optional<StudentEntity> student = studentRepository.findByStudentId(studentId);
            if (!student.isPresent()) {
                log.error("shareStudentCourseDetail() :Student account not found");
                throw new UsernameNotFoundException("Student account not found");
            }

            Optional<UserEntity> user = userRepository.findByEmail(student.get().getEmail());

            if (user.get().getUserRole() ==  Role.STUDENT) {
//                SimpleDateFormat dateFormat = new SimpleDateFormat("MMMM dd, yyyy");
//                StringBuilder body = new StringBuilder();
//                body.append("Dear Student,\n\n");
//                body.append("We hope this message finds you well. We want to share your course details with this mail.\n\n");
//
//                body.append("\n");
//                body.append("Date: ").append(dateFormat.format(new Date())).append("\n");
//                body.append("Course details : https://studentTracker.lk/course-details/"+course.get().getCourseCode()).append("\n");
//
//                body.append("Thank you for choosing our service. If you have any questions or need further assistance, feel free to reach out.\n\n");
//                body.append("Best Regards,\nYour Service Team");
//
//                mailSender.sendEmail(student.get().getEmail(), "Course Details Doc", body.toString());
            }

            return true;
        } catch (Exception e) {
            log.error("Method shareStudentOfferLetter : " + e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public List<StudentDTO> getStudents() {
        List<StudentDTO> dto = studentRepository.getStudent();
        return dto;
    }
}