package com.sms.studentTracker.service.impl;

import com.sms.studentTracker.dto.BatchDTO;
import com.sms.studentTracker.dto.CourseDTO;
import com.sms.studentTracker.dto.request.ManageBatchDTO;
import com.sms.studentTracker.dto.request.ManageCourseDTO;
import com.sms.studentTracker.entity.BatchEntity;
import com.sms.studentTracker.entity.CourseEntity;
import com.sms.studentTracker.entity.IntakeEntity;
import com.sms.studentTracker.entity.ProgrammeEntity;
import com.sms.studentTracker.exception.CustomException;
import com.sms.studentTracker.repository.BatchRepository;
import com.sms.studentTracker.repository.CourseRepository;
import com.sms.studentTracker.repository.IntakeRepository;
import com.sms.studentTracker.repository.ProgrammeRepository;
import com.sms.studentTracker.service.BatchService;
import com.sms.studentTracker.service.CourseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final ProgrammeRepository programmeRepository;
    private final ModelMapper modelMapper;

    @Override
    public CourseDTO saveCourse(ManageCourseDTO manageCourseDTO) {
        log.info("Start function saveCourse : {}", manageCourseDTO);

        try {
            Optional<ProgrammeEntity> programmeEntity = programmeRepository.findById(manageCourseDTO.getProgrammeId());
            log.info("error", programmeEntity);
            if(programmeEntity.isPresent()){
                CourseEntity courseEntity = new CourseEntity();
                courseEntity.setProgrammeEntity(programmeEntity.get());
                courseEntity.setCourseCode(manageCourseDTO.getCourseCode());
                courseEntity.setCourseName(manageCourseDTO.getCourseName());
                courseEntity.setCourseDesc(manageCourseDTO.getCourseDesc());
                courseEntity.setCourseType(manageCourseDTO.getCourseType());
                courseEntity.setTotalCredits(manageCourseDTO.getTotalCredits());
                courseEntity.setStudyMode(manageCourseDTO.getStudyMode());

                courseRepository.save(courseEntity);

                CourseDTO courseDTO = modelMapper.map(courseEntity, CourseDTO.class);
                return courseDTO;
            } else {
                throw new CustomException(1,"Programme not found");
            }
        } catch (Exception e) {
            log.error("Method saveCourse : " + e.getMessage(), e);
            throw e;
        }
    }
}
