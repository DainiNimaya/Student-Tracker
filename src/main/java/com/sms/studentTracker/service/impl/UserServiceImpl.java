package com.sms.studentTracker.service.impl;

import com.sms.studentTracker.dto.UserDTO;
import com.sms.studentTracker.dto.request.AddUserRequestDTO;
import com.sms.studentTracker.entity.UserEntity;
import com.sms.studentTracker.exception.CustomException;
//import com.sms.studentTracker.exception.CustomOauthException;
import com.sms.studentTracker.repository.UserRepository;
import com.sms.studentTracker.service.UserService;
import com.sms.studentTracker.utils.EmailSender;
import com.sms.studentTracker.utils.EmailValidator;
import com.sms.studentTracker.utils.PasswordGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
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
    @Qualifier("emailSender")
    private EmailSender mailSender;

    @Autowired
    private PasswordGenerator passwordGenerator;

//    @Autowired
//    private PasswordEncoder passwordEncoder;


    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {

        try {
            log.info("Start function loadUserByUsername : {}");
            Optional<UserEntity> user = userRepository.findByEmail(userId);
            if (!user.isPresent()) {
                log.error("loadUserByUsername() : invalid credentials");
                throw new UsernameNotFoundException("Invalid username or password.");
            }
            UserEntity userEntity = user.get();
            // Assuming user type is an Enum
            String roleString = userEntity.getUserRole().toString();

            // Create authorities for the user
            Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_" + roleString));

            return new org.springframework.security.core.userdetails.User(
                    userEntity.getEmail(),
                    userEntity.getPassword(),
                    authorities);
        } catch (Exception e) {
            log.error("Error in loadUserByUsername: " + e.getMessage(), e);
            throw new RuntimeException("An error occurred while loading user details.", e);
        }
    }

    private List<SimpleGrantedAuthority> getAuthority(UserEntity user) {
        if (user.getUserRole().equals("ACADEMIC_ADMIN")) {
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

            String newPassword = passwordGenerator.generate(12, true,true,true,true);

            userEntity.setFirstName(addNewUserRequestDTO.getFirstName());
            userEntity.setLastName(addNewUserRequestDTO.getLastName());
            userEntity.setEmail(addNewUserRequestDTO.getEmail());
            userEntity.setUserRole(addNewUserRequestDTO.getUserRole());
            userEntity.setMobileNumber(addNewUserRequestDTO.getMobileNumber());
            userEntity.setPassword(newPassword);
            userEntity.setGender(addNewUserRequestDTO.getGender());
            userEntity.setDob(addNewUserRequestDTO.getDob());
            userEntity.setNic(addNewUserRequestDTO.getNic());
            userEntity.setStatus(addNewUserRequestDTO.getStatus());

            System.out.println(userEntity);

            userEntity = userRepository.save(userEntity);

            UserDTO userDTO = modelMapper.map(userEntity, UserDTO.class);
            userDTO.setPassword(null);

//            SimpleDateFormat dateFormat = new SimpleDateFormat("MMMM dd, yyyy");
//            StringBuilder body = new StringBuilder();
//            body.append("Dear Student,\n\n");
//            body.append("We hope this message finds you well. We wanted to inform your first time password.\n\n");
//
//            body.append("\n");
//            body.append("Date: ").append(dateFormat.format(new Date())).append("\n");
//            body.append("Password : ").append(newPassword).append("\n");
//
//            body.append("Thank you for choosing our service. If you have any questions or need further assistance, feel free to reach out.\n\n");
//            body.append("Best Regards,\nYour Service Team");
//
//            mailSender.sendEmail(addNewUserRequestDTO.getEmail(), "User Credentials Information", body.toString());

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
                throw new CustomException(1,"User email not found.");
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
