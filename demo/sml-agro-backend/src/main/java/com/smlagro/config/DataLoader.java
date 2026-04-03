package com.smlagro.config;

import com.smlagro.model.*;
import com.smlagro.repository.InquiryRepository;
import com.smlagro.repository.ProductRepository;
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
    private final ProductRepository productRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public DataLoader(UserRepository userRepository, InquiryRepository inquiryRepository,
            ProductRepository productRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.inquiryRepository = inquiryRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedProducts();
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

    private void seedProducts() {
        // 1. Premium Coco Peat
        Product cocoPeat = productRepository.findAll().stream()
                .filter(p -> p.getName().equalsIgnoreCase("Premium Coco Peat"))
                .findFirst()
                .orElse(new Product());
        
        if (cocoPeat.getId() == null) {
            cocoPeat.setName("Premium Coco Peat");
            cocoPeat.setCategory(ProductCategory.COCOPEAT);
            cocoPeat.setPrice(15.0);
            cocoPeat.setUnit("5kg Block");
            cocoPeat.setIsAvailable(true);
        }
        
        if (cocoPeat.getSpecifications() == null || cocoPeat.getSpecifications().length() < 10) {
            cocoPeat.setDescription("High-quality compressed coco peat for horticulture.");
            cocoPeat.setSpecifications("[" +
                "{\"id\":\"expansion\",\"label\":\"Expansion Volume\",\"type\":\"select\",\"required\":true,\"options\":[" +
                "{\"label\":\"60-70 Liters\",\"value\":\"60-70\",\"priceImpact\":0}," +
                "{\"label\":\"75-80 Liters (High Expansion)\",\"value\":\"75-80\",\"priceImpact\":2.5}" +
                "]}," +
                "{\"id\":\"ec_level\",\"label\":\"EC Level (ms/cm)\",\"type\":\"select\",\"required\":true,\"options\":[" +
                "{\"label\":\"Low EC (< 0.5)\",\"value\":\"low\",\"priceImpact\":1.5}," +
                "{\"label\":\"Standard EC (0.5 - 1.0)\",\"value\":\"standard\",\"priceImpact\":0}" +
                "]}," +
                "{\"id\":\"washed\",\"label\":\"Triple Washed\",\"type\":\"checkbox\",\"priceImpact\":1.0}," +
                "{\"id\":\"custom_ph\",\"label\":\"Custom pH Adjustment\",\"type\":\"checkbox\",\"priceImpact\":2.0}," +
                "{\"id\":\"ph_value\",\"label\":\"Target pH\",\"type\":\"number\",\"min\":5.0,\"max\":7.5,\"dependsOn\":{\"id\":\"custom_ph\",\"value\":true},\"unit\":\"pH\"}" +
                "]");
            productRepository.save(cocoPeat);
        }

        // 2. Bristle Coir Fiber
        Product coirFiber = productRepository.findAll().stream()
                .filter(p -> p.getName().equalsIgnoreCase("Bristle Coir Fiber"))
                .findFirst()
                .orElse(new Product());

        if (coirFiber.getId() == null) {
            coirFiber.setName("Bristle Coir Fiber");
            coirFiber.setCategory(ProductCategory.FIBER);
            coirFiber.setPrice(12.0);
            coirFiber.setUnit("Bale");
            coirFiber.setIsAvailable(true);
        }

        if (coirFiber.getSpecifications() == null || coirFiber.getSpecifications().length() < 10) {
            coirFiber.setDescription("Natural golden coir fiber for industrial use.");
            coirFiber.setSpecifications("[" +
                "{\"id\":\"fiber_length\",\"label\":\"Fiber Length\",\"type\":\"select\",\"required\":true,\"options\":[" +
                "{\"label\":\"Short (5-10cm)\",\"value\":\"short\",\"priceImpact\":0}," +
                "{\"label\":\"Medium (10-15cm)\",\"value\":\"medium\",\"priceImpact\":1.5}," +
                "{\"label\":\"Long (>15cm)\",\"value\":\"long\",\"priceImpact\":3.0}" +
                "]}," +
                "{\"id\":\"moisture\",\"label\":\"Max Moisture %\",\"type\":\"number\",\"min\":10,\"max\":20,\"unit\":\"%\"}" +
                "]");
            productRepository.save(coirFiber);
        }

        // 3. Standard Grow Bag
        Product growBags = productRepository.findAll().stream()
                .filter(p -> p.getName().equalsIgnoreCase("Standard Grow Bag"))
                .findFirst()
                .orElse(new Product());

        if (growBags.getId() == null) {
            growBags.setName("Standard Grow Bag");
            growBags.setCategory(ProductCategory.GROW_BAGS);
            growBags.setPrice(5.0);
            growBags.setUnit("Bag");
            growBags.setIsAvailable(true);
        }

        if (growBags.getSpecifications() == null || growBags.getSpecifications().length() < 10) {
            growBags.setDescription("UV stabilized grow bags for professional nurseries.");
            growBags.setSpecifications("[" +
                "{\"id\":\"size\",\"label\":\"Bag Size\",\"type\":\"select\",\"required\":true,\"options\":[" +
                "{\"label\":\"100x15x10cm\",\"value\":\"small\",\"priceImpact\":0}," +
                "{\"label\":\"100x20x10cm\",\"value\":\"medium\",\"priceImpact\":1.0}," +
                "{\"label\":\"120x20x12cm\",\"value\":\"large\",\"priceImpact\":2.5}" +
                "]}," +
                "{\"id\":\"drainage_holes\",\"label\":\"Custom Drainage Holes\",\"type\":\"checkbox\",\"priceImpact\":0.5}," +
                "{\"id\":\"uv_protection\",\"label\":\"Extra UV Protection (5 years)\",\"type\":\"checkbox\",\"priceImpact\":0.75}" +
                "]");
            productRepository.save(growBags);
        }

        // Apply fallback specs to ANY product that has none (like "fsdfsd" or "coir table mats")
        List<Product> allNoSpecs = productRepository.findAll().stream()
                .filter(p -> p.getSpecifications() == null || p.getSpecifications().isEmpty() || p.getSpecifications().equals("[]"))
                .toList();
        
        if (!allNoSpecs.isEmpty()) {
            String defaultSpecs = "[" +
                "{\"id\":\"quality\",\"label\":\"Quality Grade\",\"type\":\"select\",\"required\":true,\"options\":[" +
                "{\"label\":\"Grade A (Export)\",\"value\":\"A\",\"priceImpact\":5.0}," +
                "{\"label\":\"Standard Grade\",\"value\":\"standard\",\"priceImpact\":0}" +
                "]}," +
                "{\"id\":\"packing\",\"label\":\"Special Packing\",\"type\":\"checkbox\",\"priceImpact\":1.5}" +
                "]";
            allNoSpecs.forEach(p -> p.setSpecifications(defaultSpecs));
            productRepository.saveAll(allNoSpecs);
            System.out.println("[DataLoader] 🛠️ Updated " + allNoSpecs.size() + " products with default specifications");
        }
        
        System.out.println("[DataLoader] ✅ Seeding/Patching completed");
    }
}
