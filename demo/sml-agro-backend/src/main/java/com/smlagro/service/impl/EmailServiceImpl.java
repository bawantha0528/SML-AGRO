package com.smlagro.service.impl;

import com.smlagro.model.Inquiry;
import com.smlagro.model.User;
import com.smlagro.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Autowired
    public EmailServiceImpl(JavaMailSender javaMailSender, TemplateEngine templateEngine) {
        this.javaMailSender = javaMailSender;
        this.templateEngine = templateEngine;
    }

    @Override
    @Async
    public void sendInquiryConfirmationAsync(Inquiry inquiry) {
        if (inquiry.getEmail() == null || inquiry.getEmail().isBlank()) {
            logger.warn("Inquiry {} has no email address. Skipping confirmation email.", inquiry.getId());
            return;
        }

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            // multipart=true to support fallback text and HTML
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail, "SML Agro Team");
            helper.setTo(inquiry.getEmail());
            helper.setSubject("Inquiry Received - Reference #" + inquiry.getInquiryNumber());

            // Process Thymeleaf template
            Context context = new Context();
            context.setVariable("inquiry", inquiry);

            String htmlContent = templateEngine.process("inquiry-confirmation", context);

            // Plain text fallback
            String plainTextFallback = String.format(
                    "Hello %s,\n\n" +
                            "Thank you for reaching out to SML Agro.\n" +
                            "We have received your inquiry. Your reference number is: %s.\n\n" +
                            "Our team will review your request and get back to you within 24 hours.\n\n" +
                            "Best Regards,\n" +
                            "SML Agro Team\n" +
                            "Phone: +94 716975345\n" +
                            "Email: ashen200410@gmail.com\n",
                    inquiry.getCustomerName(), inquiry.getInquiryNumber());

            // Set text fallback, and HTML content
            helper.setText(plainTextFallback, htmlContent);

            javaMailSender.send(message);
            logger.info("Confirmation email sent successfully for inquiry: {}", inquiry.getInquiryNumber());
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            logger.error("Failed to send confirmation email for inquiry: {}", inquiry.getInquiryNumber(), e);
        } catch (Exception e) {
            logger.error("Unexpected error while sending email", e);
        }
    }

    @Override
    @Async
    public void sendPasswordResetAsync(User user, String temporaryPassword) {
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            logger.warn("User {} has no email address. Skipping password reset email.", user.getUsername());
            return;
        }

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail, "SML Agro Team");
            helper.setTo(user.getEmail());
            helper.setSubject("Your SML Agro account password has been reset");

            String plainText = String.format(
                    "Hello %s,\n\n" +
                            "Your password has been reset by a super admin.\n" +
                            "Temporary Password: %s\n\n" +
                            "Please sign in and change your password immediately.\n\n" +
                            "Best Regards,\n" +
                            "SML Agro Team\n",
                    user.getUsername(), temporaryPassword);

            helper.setText(plainText, false);
            javaMailSender.send(message);

            logger.info("Password reset email sent for user: {}", user.getUsername());
        } catch (Exception e) {
            logger.error("Failed to send password reset email for user: {}", user.getUsername(), e);
        }
    }
}
