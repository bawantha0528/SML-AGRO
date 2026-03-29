package com.smlagro.service;

import com.smlagro.model.Inquiry;

public interface EmailService {
    void sendInquiryConfirmationAsync(Inquiry inquiry);
}
