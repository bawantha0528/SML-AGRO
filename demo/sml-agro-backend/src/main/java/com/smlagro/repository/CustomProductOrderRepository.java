package com.smlagro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.smlagro.model.CustomOrderStatus;
import com.smlagro.model.CustomProductOrder;

@Repository
public interface CustomProductOrderRepository extends JpaRepository<CustomProductOrder, Long> {

    List<CustomProductOrder> findAllByOrderByCreatedAtDesc();

    List<CustomProductOrder> findByStatusOrderByCreatedAtDesc(CustomOrderStatus status);

    @Query("SELECT o FROM CustomProductOrder o WHERE " +
            "LOWER(o.customerName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(o.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(o.orderNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(o.productType) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "ORDER BY o.createdAt DESC")
    List<CustomProductOrder> search(@Param("keyword") String keyword);

    @Query("SELECT o FROM CustomProductOrder o WHERE o.status = :status AND (" +
            "LOWER(o.customerName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(o.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(o.orderNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(o.productType) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "ORDER BY o.createdAt DESC")
    List<CustomProductOrder> searchByStatus(@Param("status") CustomOrderStatus status,
                                            @Param("keyword") String keyword);
}
