package com.sms.studentTracker.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "feeScheme")
public class FeeSchemeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long feeSchemeId;

    @Column(length = 255)
    private String feeScheme;

    @Column(length = 255)
    private String feeDesc;

}
