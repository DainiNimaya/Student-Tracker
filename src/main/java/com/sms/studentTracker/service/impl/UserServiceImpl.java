package com.sms.studentTracker.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.sms.studentTracker.dto.UserDTO;
import com.sms.studentTracker.dto.request.AddUserRequestDTO;
import com.sms.studentTracker.entity.UserEntity;
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

import java.util.Arrays;
import java.util.List;

@Service(value = "userService")
@RequiredArgsConstructor
@Log4j2
@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
public class UserServiceImpl implements UserDetailsService, UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;
    private final ModelMapper modelMapper;

    @Autowired
    private EmailValidator emailValidator;

    @Autowired
    private PasswordEncoder passwordEncoder;


//    @Autowired
//    public UserServiceImpl(UserRepository userRepository, BCryptPasswordEncoder encoder){
//        this.userRepository = userRepository;
//        this.encoder = encoder;
//    }

    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {

        System.out.println("Start function loadUserByUsernamel : {}");
        UserEntity user = userRepository.findByEmail(userId);
        if(user == null){
            throw new UsernameNotFoundException("Invalid username or password.");
        }
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), getAuthority(user));
    }

//    private List getAuthority() {
//        return Arrays.asList(new SimpleGrantedAuthority("ROLE_ADMIN"));
//    }

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

            userEntity = userRepository.save(userEntity);

            UserDTO userDTO = modelMapper.map(userEntity, UserDTO.class);
            userDTO.setPassword(null);
            return userDTO;
        }
        return null;
    }
}
