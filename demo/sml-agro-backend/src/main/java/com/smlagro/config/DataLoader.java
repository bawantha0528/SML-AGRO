package com.smlagro.config;

import com.smlagro.model.*;
import com.smlagro.repository.InquiryRepository;
import com.smlagro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DataLoader seeds the database with default users and sample inquiries
 * if the tables are empty. Safe to run on every startup (idempotent).
 */
@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final InquiryRepository inquiryRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public DataLoader(UserRepository userRepository, InquiryRepository inquiryRepository,
            BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.inquiryRepository = inquiryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedSampleInquiries();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@smlagro.com");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setFullName("System Administrator");
            admin.setRole(UserRole.ADMIN);
            admin.setIsActive(true);

            User sales = new User();
            sales.setUsername("sales");
            sales.setEmail("sales@smlagro.com");
            sales.setPasswordHash(passwordEncoder.encode("sales123"));
            sales.setFullName("Sales Manager");
            sales.setRole(UserRole.SALES);
            sales.setIsActive(true);

            userRepository.saveAll(List.of(admin, sales));
            System.out.println("[DataLoader] ✅ Default users created: admin/admin123, sales/sales123");
        }
    }

    private void seedSampleInquiries() {
        if (inquiryRepository.count() == 0) {
            List<Inquiry> samples = List.of(
                    makeInquiry("James Wilson", "james.wilson@greenworld.us", "+1 555 0101", "GreenWorld Agriculture",
                            "USA",
                            "Coir Fiber, Grow Bags", "500 MT", "Need EC below 0.5. Monthly supply preferred.",
                            InquiryStatus.NEW, Priority.HIGH, -1),
                    makeInquiry("Mei Zhang", "mei.zhang@horizonfarm.cn", "+86 138 0000 1234", "HorizonFarm Co.",
                            "China",
                            "Coir Pith / Cocopeat", "200 MT", "Looking for 5kg compressed blocks. Send samples first.",
                            InquiryStatus.RESPONDED, Priority.HIGH, -3),
                    makeInquiry("Hans Mueller", "hans.mueller@biogrow.de", "+49 30 1234567", "BioGrow GmbH", "Germany",
                            "Geotextiles, Coir Mats", "100 MT", "Need EU certification documentation.",
                            InquiryStatus.FOLLOWUP, Priority.MEDIUM, -5),
                    makeInquiry("Aisha Al-Rashid", "aisha@greentech.ae", "+971 50 123 4567", "GreenTech UAE", "UAE",
                            "Grow Bags", "50 MT", "Trial order for tomato greenhouse project.", InquiryStatus.QUOTED,
                            Priority.MEDIUM, -7),
                    makeInquiry("Sophie Martin", "sophie@naturalis.fr", "+33 1 23456789", "Naturalis SARL", "France",
                            "Coir Fiber", "300 MT", "Enquiring for Q2 supply. Please send price list.",
                            InquiryStatus.NEW, Priority.LOW, -2),
                    makeInquiry("David Kim", "david.kim@farmtech.kr", "+82 10 1234 5678", "FarmTech Korea",
                            "South Korea",
                            "Coir Pith / Cocopeat", "150 MT", "Need USDA organic certification if available.",
                            InquiryStatus.CLOSED, Priority.MEDIUM, -14),
                    makeInquiry("Priya Patel", "priya@agromart.in", "+91 98765 43210", "AgroMart India", "India",
                            "Coir Fiber, Coir Mats", "75 MT", "Regular buyer since 2022. New order for FY2025.",
                            InquiryStatus.RESPONDED, Priority.HIGH, -4),
                    makeInquiry("Carlos Rivera", "carlos@agroprime.mx", "+52 55 1234 5678", "AgroPrime Mexico",
                            "Mexico",
                            "Grow Bags", "120 MT", "First inquiry. Interested in strawberry cultivation bags.",
                            InquiryStatus.NEW, Priority.MEDIUM, -1));
            inquiryRepository.saveAll(samples);
            System.out.println("[DataLoader] ✅ Sample inquiries created (" + samples.size() + " records)");
        }
    }

    private Inquiry makeInquiry(String name, String email, String phone, String company,
            String country, String products, String quantity,
            String requirements, InquiryStatus status, Priority priority, int daysOffset) {
        Inquiry i = new Inquiry();
        i.setCustomerName(name);
        i.setEmail(email);
        i.setPhone(phone);
        i.setCompany(company);
        i.setCountry(country);
        i.setProductsRequested(products);
        i.setEstimatedQuantity(quantity);
        i.setSpecialRequirements(requirements);
        i.setStatus(status);
        i.setPriority(priority);
        i.setCreatedAt(LocalDateTime.now().plusDays(daysOffset));
        if (status == InquiryStatus.RESPONDED || status == InquiryStatus.QUOTED || status == InquiryStatus.CLOSED) {
            i.setRespondedAt(LocalDateTime.now().plusDays(daysOffset + 1));
        }
        if (status == InquiryStatus.CLOSED) {
            i.setClosedAt(LocalDateTime.now().plusDays(daysOffset + 3));
        }
        return i;
    }
}
