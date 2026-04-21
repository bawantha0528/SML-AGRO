package com.smlagro.dto.response;

import java.time.LocalDateTime;

import com.smlagro.model.InquiryPrivateNote;

public class InquiryPrivateNoteResponse {

    private Long id;
    private String authorUsername;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean canEdit;

    public static InquiryPrivateNoteResponse fromEntity(InquiryPrivateNote note, boolean canEdit) {
        InquiryPrivateNoteResponse response = new InquiryPrivateNoteResponse();
        response.setId(note.getId());
        response.setAuthorUsername(note.getAuthorUsername());
        response.setContent(note.getContent());
        response.setCreatedAt(note.getCreatedAt());
        response.setUpdatedAt(note.getUpdatedAt());
        response.setCanEdit(canEdit);
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAuthorUsername() {
        return authorUsername;
    }

    public void setAuthorUsername(String authorUsername) {
        this.authorUsername = authorUsername;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isCanEdit() {
        return canEdit;
    }

    public void setCanEdit(boolean canEdit) {
        this.canEdit = canEdit;
    }
}
