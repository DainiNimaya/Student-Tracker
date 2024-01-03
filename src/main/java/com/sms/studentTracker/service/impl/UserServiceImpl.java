package com.sms.studentTracker.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.sms.studentTracker.dto.UserDTO;
import com.sms.studentTracker.dto.request.AddUserRequestDTO;
import com.sms.studentTracker.entity.UserEntity;
import com.sms.studentTracker.exception.CustomOauthException;
import com.sms.studentTracker.repository.UserRepository;
import com.sms.studentTracker.service.UserService;
import com.sms.studentTracker.utils.EmailValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service(value = "userService")
@RequiredArgsConstructor
@Log4j2
@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
public class UserServiceImpl implements UserDetailsService, UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Autowired
    private EmailValidator emailValidator;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {

        try{
            System.out.println("Start function loadUserByUsernamel : {}");
            Optional<UserEntity> user = userRepository.findByEmail(userId);
            if(user == null){
                throw new UsernameNotFoundException("Invalid username or password.");
            }
            UserEntity userEntity = user.get();
            String roleString = userEntity.getUserRole().toString(); // Assuming user type is an Enum

            // Create authorities for the user
            Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_" + roleString));

            return new org.springframework.security.core.userdetails.User(
                    userEntity.getEmail(),
                    userEntity.getPassword(),
                    authorities);
        } catch (Exception e) {
            // Log and handle any exceptions
            log.error("Error in loadUserByUsername: " + e.getMessage(), e);
            throw new RuntimeException("An error occurred while loading user details.", e);
        }

    }

    private List<SimpleGrantedAuthority> getAuthority(UserEntity user) {
        System.out.println(user.getUserRole());
        if (user.getUserRole().equals("ACADEMIC_ADMIN")){
            return Arrays.asList(new SimpleGrantedAuthority(user.getUserRole().toString()));
        }
        throw new UsernameNotFoundException("Access Denied");
    }

    @Override
    public UserDTO saveUser(AddUserRequestDTO addNewUserRequestDTO) {
        log.info("Start function saveUser : {}", addNewUserRequestDTO);
        boolean isValidEmail = emailValidator.isValidEmail(addNewUserRequestDTO.getEmail());

        UserEntity userEntity = new UserEntity();
        if (isValidEmail) {
            userEntity.setFirstName(addNewUserRequestDTO.getFirstName());
            userEntity.setLastName(addNewUserRequestDTO.getLastName());
            userEntity.setEmail(addNewUserRequestDTO.getEmail());
            userEntity.setUserRole(addNewUserRequestDTO.getUserRole());
            userEntity.setMobileNumber(addNewUserRequestDTO.getMobileNumber());
            userEntity.setPassword(passwordEncoder.encode(addNewUserRequestDTO.getPassword()));
            userEntity.setGender(addNewUserRequestDTO.getGender());
            userEntity.setDob(addNewUserRequestDTO.getDob());
            userEntity.setNic(addNewUserRequestDTO.getNic());
            userEntity.setStatus(addNewUserRequestDTO.getStatus());

            userEntity = userRepository.save(userEntity);

            UserDTO userDTO = modelMapper.map(userEntity, UserDTO.class);
            userDTO.setPassword(null);
            return userDTO;
        }
        return null;
    }

    @Override
    public UserDTO getUserDetailsByUserEmail(String userEmail) {
        try {
            // Check if a user with the given email exists
            Optional<UserEntity> byUserEmail = userRepository.findByEmail(userEmail);
            if (!byUserEmail.isPresent()) {
                throw new CustomOauthException("User email not found.");
            } else {
                // Create and return UserDto
                return new UserDTO(
                        byUserEmail.get().getId(),
                        byUserEmail.get().getFirstName(),
                        byUserEmail.get().getLastName(),
                        byUserEmail.get().getEmail(),
                        byUserEmail.get().getMobileNumber(),
                        byUserEmail.get().getPassword(),
                        byUserEmail.get().getUserRole(),
                        byUserEmail.get().getGender(),
                        byUserEmail.get().getDob(),
                        byUserEmail.get().getNic(),
                        byUserEmail.get().getStatus()
                );
            }
        } catch (Exception e) {
            // Log and handle any exceptions
            log.error("Method getUserDetailsByUserEmail : " + e.getMessage(), e);
            throw e;
        }
    }
}
