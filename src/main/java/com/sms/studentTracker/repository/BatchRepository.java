package com.sms.studentTracker.repository;

import com.sms.studentTracker.dto.BatchDTO;
import com.sms.studentTracker.entity.BatchEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BatchRepository extends JpaRepository<BatchEntity, Long> {

    @Query(value = "SELECT new com.sms.studentTracker.dto.BatchDTO(ss.batchId, ss.batchName) FROM BatchEntity ss WHERE ss.intakeEntity = 1")
    List<BatchDTO> getBatch(String intakeId);

    Optional<BatchEntity> findByBatchId(long batchId);

}