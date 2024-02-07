package com.sms.studentTracker.repository;

import com.sms.studentTracker.entity.PaymentPlanEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentPlanRepository extends JpaRepository<PaymentPlanEntity, Long> {

}
