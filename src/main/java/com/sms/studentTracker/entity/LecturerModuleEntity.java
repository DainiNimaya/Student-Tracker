package com.sms.studentTracker.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "lecture_module")
public class LecturerModuleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long lmId;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private UserEntity userEntity;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "module_id", unique = true, nullable = false)
    private ModuleEntity moduleEntity;

}
