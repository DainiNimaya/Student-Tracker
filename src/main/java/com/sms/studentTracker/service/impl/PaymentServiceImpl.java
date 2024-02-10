package com.sms.studentTracker.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.sms.studentTracker.dto.BatchDTO;
import com.sms.studentTracker.dto.request.ManageBatchDTO;
import com.sms.studentTracker.dto.request.SubmitBankSlipReqDTO;
import com.sms.studentTracker.entity.BatchEntity;
import com.sms.studentTracker.entity.IntakeEntity;
import com.sms.studentTracker.exception.CustomException;
import com.sms.studentTracker.repository.BatchRepository;
import com.sms.studentTracker.repository.IntakeRepository;
import com.sms.studentTracker.service.BatchService;
import com.sms.studentTracker.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
public class PaymentServiceImpl implements PaymentService {

    private final ModelMapper modelMapper;

    @Override
    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
    public boolean uploadBankSlip(SubmitBankSlipReqDTO dto) {
        log.info("Execute method uploadBankSlip : @param : {} " + dto.getDepositDate());
        try {
            String fileURL = null;
            if (dto.getFile() != null) {
                // Assuming you have a local folder to store the files
                String localFolderPath = "/path/to/local/folder/";

                // Generate a unique file name based on your requirements
                String fileName = generateFileName(dto.getFile());

                // Combine the folder path and file name to get the local file path
                String localFilePath = localFolderPath + fileName;

                // Save the file locally
                saveFileLocally(dto.getFile(), localFilePath);

                // Set the file URL to the local file path
                fileURL = localFilePath;

                // Check if the file was saved successfully
                if (fileURL == null) {
                    log.error("File save has failed.");
                    throw new CustomException(1, "The particular file failed to be saved.");
                }

                return true;
            }

         }catch(Exception e){
            log.error("Method uploadBankSlip : " + e.getMessage(), e);
            throw new CustomException(1, "Fail to save.");
        }
            return false;

    }


    // Add a method to save the file locally
    private void saveFileLocally (File file, String localFilePath){
//        try {
//            // You may need to customize this based on the framework or library you are using
//            File localFile = new File(localFilePath);
//            file.transferTo(localFile);
//        } catch (IOException e) {
//            // Handle the exception appropriately
//            log.error("Error saving file locally: " + e.getMessage());
//            throw new CustomException(1,"Failed to save the file locally.");
//        }
    }

    // Add a method to save the file locally
    private String generateFileName (File file){
//        try {
//            // You may need to customize this based on the framework or library you are using
//            File localFile = new File(localFilePath);
//            file.transferTo(localFile);
//        } catch (IOException e) {
//            // Handle the exception appropriately
//            log.error("Error generating file name: " + e.getMessage());
//            throw new CustomException(1,"Failed to generate a file name.");
//        }
        return "abc";
    }


}