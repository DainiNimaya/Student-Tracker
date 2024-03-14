package com.sms.studentTracker.repository;

import com.sms.studentTracker.dto.StudentDTO;
import com.sms.studentTracker.entity.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<StudentEntity, Long> {

    Optional<StudentEntity> findByStudentId(long studentId);

    @Query(value = "SELECT new com.sms.studentTracker.dto.StudentDTO(ss.studentId, ss.fullName, ss.preferedName, ss.email, ss.countryOfBirth, ss.nationality, ss.applyingCountry, ss.address, ss.mobile1, ss.mobile2, ss.gender, ss.statement, ss.paymentDoneBy, ss.isDiabled, ss.disabledDesc, ss.isCriminalConviction) " +
            "FROM StudentEntity ss ")
    List<StudentDTO> getStudent();

}