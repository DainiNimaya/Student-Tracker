package com.sms.studentTracker.service.impl;

import com.sms.studentTracker.dto.ModuleDTO;
import com.sms.studentTracker.dto.request.ManageModuleDTO;
import com.sms.studentTracker.entity.LecturerModuleEntity;
import com.sms.studentTracker.entity.ModuleEntity;
import com.sms.studentTracker.entity.UserEntity;
import com.sms.studentTracker.exception.CustomException;
import com.sms.studentTracker.repository.LecturerModuleRepository;
import com.sms.studentTracker.repository.ModuleRepository;
import com.sms.studentTracker.repository.UserRepository;
import com.sms.studentTracker.service.ModuleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import com.sms.studentTracker.enums.Role;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
public class ModuleServiceImpl implements ModuleService {

    private final ModuleRepository moduleRepository;
    private final UserRepository userRepository;
    private final LecturerModuleRepository lecturerModuleRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
    public ModuleDTO saveModule(ManageModuleDTO manageModuleDTO) {
        log.info("Start function saveModule : {}", manageModuleDTO);

        try{
            ModuleEntity moduleEntity = new ModuleEntity();
            moduleEntity.setModuleName(manageModuleDTO.getModuleName());
            moduleEntity.setModuleCode(manageModuleDTO.getModuleCode());
            moduleEntity.setModuleDesc(manageModuleDTO.getModuleDesc());
            moduleEntity.setNoOfCredits(manageModuleDTO.getNoOfCredits());
            moduleEntity.setModuleType(manageModuleDTO.getModuleType());

            moduleRepository.save(moduleEntity);

            ModuleDTO moduleDTO = modelMapper.map(moduleEntity, ModuleDTO.class);

            if(manageModuleDTO.getLecturers().length != 0){
                for (long userId:manageModuleDTO.getLecturers()) {
                    Optional <UserEntity> userEntity = userRepository.findById(userId);
                    if(userEntity.isPresent()){
                        if(userEntity.get().getUserRole() == Role.LECTURER){

                            LecturerModuleEntity lecturerModuleEntity = new LecturerModuleEntity();
                            lecturerModuleEntity.setModuleEntity(moduleEntity);
                            lecturerModuleEntity.setUserEntity(userEntity.get());

                            lecturerModuleRepository.save(lecturerModuleEntity);

                        } else {
                            throw new CustomException(1,"User is not a lecturer: "+userId);
                        }
                    } else {
                        throw new CustomException(1,"Lecturer not found where userId: "+userId);
                    }
                }
            }

            return moduleDTO;

        } catch (Exception e){
            log.error("Method saveModule : " + e.getMessage(), e);
            throw e;
        }


    }
}
