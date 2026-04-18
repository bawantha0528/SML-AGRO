package com.smlagro.controller;

import com.smlagro.dto.request.AdminCreateUserRequest;
import com.smlagro.dto.request.AdminUpdateUserRequest;
import com.smlagro.dto.request.AdminUpdateUserRoleRequest;
import com.smlagro.dto.request.AdminUpdateUserStatusRequest;
import com.smlagro.dto.response.AdminUserResponse;
import com.smlagro.dto.response.ApiResponse;
import com.smlagro.model.UserRole;
import com.smlagro.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*")
public class AdminUserController {

	private final UserService userService;

	@Autowired
	public AdminUserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping
	public ResponseEntity<ApiResponse<List<AdminUserResponse>>> getAllUsers(
			@RequestParam(required = false) String search,
			@RequestParam(required = false) UserRole role) {
		return ResponseEntity.ok(ApiResponse.ok(userService.getAllUsers(search, role)));
	}

	@PostMapping
	public ResponseEntity<ApiResponse<AdminUserResponse>> createUser(
			@Valid @RequestBody AdminCreateUserRequest request) {
		try {
			AdminUserResponse created = userService.createUser(request);
			return ResponseEntity.status(HttpStatus.CREATED)
					.body(ApiResponse.ok("User created successfully", created));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
		}
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<AdminUserResponse>> updateUser(
			@PathVariable Long id,
			@Valid @RequestBody AdminUpdateUserRequest request) {
		try {
			AdminUserResponse updated = userService.updateUser(id, request);
			return ResponseEntity.ok(ApiResponse.ok("User updated successfully", updated));
		} catch (IllegalArgumentException e) {
			HttpStatus status = e.getMessage().contains("not found") ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
			return ResponseEntity.status(status).body(ApiResponse.error(e.getMessage()));
		}
	}

	@PatchMapping("/{id}/role")
	public ResponseEntity<ApiResponse<AdminUserResponse>> updateRole(
			@PathVariable Long id,
			@Valid @RequestBody AdminUpdateUserRoleRequest request) {
		try {
			AdminUserResponse updated = userService.updateUserRole(id, request.getRole());
			return ResponseEntity.ok(ApiResponse.ok("Role updated successfully", updated));
		} catch (IllegalArgumentException e) {
			HttpStatus status = e.getMessage().contains("not found") ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
			return ResponseEntity.status(status).body(ApiResponse.error(e.getMessage()));
		}
	}

	@PatchMapping("/{id}/status")
	public ResponseEntity<ApiResponse<AdminUserResponse>> updateStatus(
			@PathVariable Long id,
			@Valid @RequestBody AdminUpdateUserStatusRequest request) {
		try {
			AdminUserResponse updated = userService.updateUserStatus(id, request.getIsActive());
			return ResponseEntity.ok(ApiResponse.ok("Status updated successfully", updated));
		} catch (IllegalArgumentException e) {
			HttpStatus status = e.getMessage().contains("not found") ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
			return ResponseEntity.status(status).body(ApiResponse.error(e.getMessage()));
		}
	}

	@PostMapping("/{id}/reset-password")
	public ResponseEntity<ApiResponse<Void>> resetPassword(@PathVariable Long id) {
		try {
			userService.resetPassword(id);
			return ResponseEntity.ok(ApiResponse.ok("Password reset email sent", null));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
		try {
			userService.deleteUser(id);
			return ResponseEntity.ok(ApiResponse.ok("User deleted successfully", null));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
		}
	}
}
