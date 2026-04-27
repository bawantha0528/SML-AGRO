package com.smlagro.service;

import com.smlagro.model.Inquiry;
import com.smlagro.model.User;

public interface EmailService {
    void sendInquiryConfirmationAsync(Inquiry inquiry);

    void sendPasswordResetAsync(User user, String temporaryPassword);
}
