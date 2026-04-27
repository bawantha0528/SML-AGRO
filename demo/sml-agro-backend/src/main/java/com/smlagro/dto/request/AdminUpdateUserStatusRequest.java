package com.smlagro.dto.request;

import jakarta.validation.constraints.NotNull;

public class AdminUpdateUserStatusRequest {

    @NotNull(message = "isActive is required")
    private Boolean isActive;

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
