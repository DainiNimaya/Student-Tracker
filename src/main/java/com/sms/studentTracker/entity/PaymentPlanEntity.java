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
@Table(name = "payment_plan")
public class PaymentPlanEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long paymentPlanId;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "feeScheme_id", unique = true, nullable = false)
    private FeeSchemeEntity feeSchemeEntity;

    @Column(length = 255)
    private String planName;

    @Column(length = 255)
    private String interval;

}
