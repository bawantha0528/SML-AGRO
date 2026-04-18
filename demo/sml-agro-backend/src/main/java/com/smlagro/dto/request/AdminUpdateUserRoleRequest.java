package com.smlagro.dto.request;

import com.smlagro.model.UserRole;
import jakarta.validation.constraints.NotNull;

public class AdminUpdateUserRoleRequest {

    @NotNull(message = "Role is required")
    private UserRole role;

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}
