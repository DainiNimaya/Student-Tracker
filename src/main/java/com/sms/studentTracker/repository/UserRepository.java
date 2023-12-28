package com.sms.studentTracker.repository;

import com.sms.studentTracker.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository  extends JpaRepository<UserEntity, Long> {
    UserEntity findByEmail(String email);

}
