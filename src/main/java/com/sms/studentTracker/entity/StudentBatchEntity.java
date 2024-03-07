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
@Table(name = "studentBatch")
public class StudentBatchEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long studentBatchId;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "student_id", unique = true, nullable = false)
    private StudentEntity studentEntity;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "batch_id", unique = true, nullable = false)
    private BatchEntity batchEntity;
}
