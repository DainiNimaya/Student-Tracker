package com.sms.studentTracker.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.sms.studentTracker.enums.FeeType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payment_structure")
public class PaymentStructureEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long paymentStructureId;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "payment_plan_id", unique = true, nullable = false)
    private PaymentPlanEntity paymentPlanEntity;

    @Enumerated(EnumType.STRING)
    private FeeType feeType;

    @Column
    private BigDecimal amount;

    @Column
    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss")
    private Date dueDate;



}
