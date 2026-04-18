package com.smlagro.service;

import com.smlagro.dto.request.AdminCreateUserRequest;
import com.smlagro.dto.request.AdminUpdateUserRequest;
import com.smlagro.model.UserRole;
import com.smlagro.dto.response.AdminUserResponse;

import java.util.List;

public interface UserService {

	List<AdminUserResponse> getAllUsers(String search, UserRole role);

	AdminUserResponse createUser(AdminCreateUserRequest request);

	AdminUserResponse updateUser(Long id, AdminUpdateUserRequest request);

	AdminUserResponse updateUserRole(Long id, UserRole role);

	AdminUserResponse updateUserStatus(Long id, Boolean isActive);

	void resetPassword(Long id);

	void deleteUser(Long id);
}
