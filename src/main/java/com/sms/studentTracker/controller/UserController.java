package com.sms.studentTracker.controller;

import com.sms.studentTracker.dto.UserDTO;
import com.sms.studentTracker.service.UserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Log4j2
@RequestMapping("/use")
public class UserController {

    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public String listUser(){
        return "Hello";
    }
//
//    @PostMapping(value = "/user")
//    public UserDTO saveUser(@RequestBody User user){
//        return userService.save(user);
//    }
//
//    @PutMapping("/user/{id}")
//    public User updateUser(@RequestBody User user){
//        return userService.save(user);
//    }
//
//    @DeleteMapping(value = "/user/{id}")
//    public String delete(@PathVariable(value = "id") Long id){
//        userService.delete(id);
//        return "User Deleted Successfully!";
//    }

}
