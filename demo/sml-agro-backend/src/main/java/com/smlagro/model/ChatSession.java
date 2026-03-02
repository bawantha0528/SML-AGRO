package com.smlagro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_sessions", indexes = {
        @Index(name = "idx_chat_session_id", columnList = "session_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", unique = true, nullable = false, length = 50)
    private String sessionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "user_ip", length = 45)
    private String userIp;

    @Column(columnDefinition = "TEXT")
    private String context;

    @Column(name = "messages_json", columnDefinition = "TEXT", nullable = false)
    private String messagesJson;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_activity")
    private LocalDateTime lastActivity;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.lastActivity = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.lastActivity = LocalDateTime.now();
    }
}
