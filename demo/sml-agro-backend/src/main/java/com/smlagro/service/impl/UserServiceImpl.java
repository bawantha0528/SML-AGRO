package com.smlagro.service.impl;

import com.smlagro.dto.request.AdminCreateUserRequest;
import com.smlagro.dto.request.AdminUpdateUserRequest;
import com.smlagro.dto.response.AdminUserResponse;
import com.smlagro.model.User;
import com.smlagro.model.UserRole;
import com.smlagro.repository.UserRepository;
import com.smlagro.service.EmailService;
import com.smlagro.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
public class UserServiceImpl implements UserService {

	private static final String TEMP_PASSWORD_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$!";

	private final UserRepository userRepository;
	private final BCryptPasswordEncoder passwordEncoder;
	private final EmailService emailService;
	private final SecureRandom secureRandom = new SecureRandom();

	@Autowired
	public UserServiceImpl(UserRepository userRepository,
			BCryptPasswordEncoder passwordEncoder,
			EmailService emailService) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.emailService = emailService;
	}

	@Override
	public List<AdminUserResponse> getAllUsers(String search, UserRole role) {
		String q = search == null ? "" : search.trim().toLowerCase(Locale.ROOT);

		return userRepository.findAll().stream()
				.filter(user -> role == null || user.getRole() == role)
				.filter(user -> q.isBlank() || user.getUsername().toLowerCase(Locale.ROOT).contains(q)
						|| user.getEmail().toLowerCase(Locale.ROOT).contains(q))
				.sorted(Comparator.comparing(User::getId).reversed())
				.map(AdminUserResponse::fromEntity)
				.toList();
	}

	@Override
	public AdminUserResponse createUser(AdminCreateUserRequest request) {
		String normalizedUsername = request.getUsername().trim();
		String normalizedEmail = request.getEmail().trim().toLowerCase(Locale.ROOT);

		if (Boolean.TRUE.equals(userRepository.existsByUsername(normalizedUsername))) {
			throw new IllegalArgumentException("Username already exists");
		}
		if (Boolean.TRUE.equals(userRepository.existsByEmail(normalizedEmail))) {
			throw new IllegalArgumentException("Email already exists");
		}

		User user = new User();
		user.setUsername(normalizedUsername);
		user.setEmail(normalizedEmail);
		user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
		user.setRole(UserRole.SUPPORT);
		user.setIsActive(true);

		return AdminUserResponse.fromEntity(userRepository.save(user));
	}

	@Override
	public AdminUserResponse updateUser(Long id, AdminUpdateUserRequest request) {
		User user = findUserOrThrow(id);
		String normalizedUsername = request.getUsername().trim();
		String normalizedEmail = request.getEmail().trim().toLowerCase(Locale.ROOT);

		userRepository.findByUsername(normalizedUsername)
				.filter(found -> !found.getId().equals(id))
				.ifPresent(found -> {
					throw new IllegalArgumentException("Username already exists");
				});

		userRepository.findByEmail(normalizedEmail)
				.filter(found -> !found.getId().equals(id))
				.ifPresent(found -> {
					throw new IllegalArgumentException("Email already exists");
				});

		user.setUsername(normalizedUsername);
		user.setEmail(normalizedEmail);
		user.setRole(request.getRole());
		user.setIsActive(Boolean.TRUE.equals(request.getIsActive()));

		return AdminUserResponse.fromEntity(userRepository.save(user));
	}

	@Override
	public AdminUserResponse updateUserRole(Long id, UserRole role) {
		User user = findUserOrThrow(id);
		user.setRole(role);
		return AdminUserResponse.fromEntity(userRepository.save(user));
	}

	@Override
	public AdminUserResponse updateUserStatus(Long id, Boolean isActive) {
		User user = findUserOrThrow(id);
		user.setIsActive(Boolean.TRUE.equals(isActive));
		return AdminUserResponse.fromEntity(userRepository.save(user));
	}

	@Override
	public void resetPassword(Long id) {
		User user = findUserOrThrow(id);
		String tempPassword = generateTemporaryPassword(12);
		user.setPasswordHash(passwordEncoder.encode(tempPassword));
		userRepository.save(user);
		emailService.sendPasswordResetAsync(user, tempPassword);
	}

	@Override
	public void deleteUser(Long id) {
		User user = findUserOrThrow(id);
		userRepository.delete(user);
	}

	private User findUserOrThrow(Long id) {
		return userRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));
	}

	private String generateTemporaryPassword(int length) {
		StringBuilder value = new StringBuilder(length);
		for (int i = 0; i < length; i++) {
			int idx = secureRandom.nextInt(TEMP_PASSWORD_CHARS.length());
			value.append(TEMP_PASSWORD_CHARS.charAt(idx));
		}
		return value.toString();
	}
}
