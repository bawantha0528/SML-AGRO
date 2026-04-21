package com.smlagro.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smlagro.dto.request.InquiryPrivateNoteRequest;
import com.smlagro.dto.response.ApiResponse;
import com.smlagro.dto.response.InquiryPrivateNoteResponse;
import com.smlagro.dto.response.InquiryResponse;
import com.smlagro.model.InquiryStatus;
import com.smlagro.model.Priority;
import com.smlagro.service.InquiryService;

@RestController
@RequestMapping("/api/admin/inquiries")
public class AdminInquiryController {

    private final InquiryService inquiryService;

    @Autowired
    public AdminInquiryController(InquiryService inquiryService) {
        this.inquiryService = inquiryService;
    }

    /**
     * GET /api/admin/inquiries
     * Optional query params: status=NEW, search=keyword
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<InquiryResponse>>> getInquiries(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {

        List<InquiryResponse> inquiries;

        if (search != null && !search.isBlank()) {
            inquiries = inquiryService.searchInquiries(search, status);
        } else if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            try {
                InquiryStatus statusEnum = InquiryStatus.valueOf(status.toUpperCase());
                inquiries = inquiryService.getInquiriesByStatus(statusEnum);
            } catch (IllegalArgumentException e) {
                inquiries = inquiryService.getAllInquiries();
            }
        } else {
            inquiries = inquiryService.getAllInquiries();
        }

        return ResponseEntity.ok(ApiResponse.ok(inquiries));
    }

    /**
     * GET /api/admin/inquiries/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InquiryResponse>> getInquiry(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(inquiryService.getInquiryById(id)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * PATCH /api/admin/inquiries/{id}/status
     * Body: { "status": "RESPONDED" }
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<InquiryResponse>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            InquiryStatus newStatus = InquiryStatus.valueOf(body.get("status").toUpperCase());
            InquiryResponse updated = inquiryService.updateStatus(id, newStatus);
            return ResponseEntity.ok(ApiResponse.ok("Status updated to " + newStatus, updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid status value"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * PATCH /api/admin/inquiries/{id}/priority
     * Body: { "priority": "HIGH" }
     */
    @PatchMapping("/{id}/priority")
    public ResponseEntity<ApiResponse<InquiryResponse>> updatePriority(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            Priority priority = Priority.valueOf(body.get("priority").toUpperCase());
            InquiryResponse updated = inquiryService.updatePriority(id, priority);
            return ResponseEntity.ok(ApiResponse.ok("Priority updated", updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid priority value"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * PATCH /api/admin/inquiries/{id}/notes
     * Body: { "notes": "Called customer, interested in 500MT..." }
     */
    @PatchMapping("/{id}/notes")
    public ResponseEntity<ApiResponse<InquiryResponse>> updateNotes(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            InquiryResponse updated = inquiryService.updateNotes(id, body.get("notes"));
            return ResponseEntity.ok(ApiResponse.ok("Notes saved", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * PATCH /api/admin/inquiries/{id}/followup-date
     * Body: { "followupDate": "2026-04-20" }
     */
    @PatchMapping("/{id}/followup-date")
    public ResponseEntity<ApiResponse<InquiryResponse>> updateFollowupDate(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            String followupDate = body.get("followupDate");
            if (followupDate == null || followupDate.isBlank()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("followupDate is required"));
            }
            LocalDate date = LocalDate.parse(followupDate);
            InquiryResponse updated = inquiryService.scheduleFollowup(id, date);
            return ResponseEntity.ok(ApiResponse.ok("Follow-up date saved", updated));
        } catch (java.time.format.DateTimeParseException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid follow-up date. Use yyyy-MM-dd"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * PATCH /api/admin/inquiries/{id}/followup-reschedule
     * Body: { "followupDate": "2026-04-25" }
     */
    @PatchMapping("/{id}/followup-reschedule")
    public ResponseEntity<ApiResponse<InquiryResponse>> rescheduleFollowup(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return updateFollowupDate(id, body);
    }

    /**
     * PATCH /api/admin/inquiries/{id}/followup-complete
     */
    @PatchMapping("/{id}/followup-complete")
    public ResponseEntity<ApiResponse<InquiryResponse>> markFollowupCompleted(@PathVariable Long id) {
        try {
            InquiryResponse updated = inquiryService.markFollowupCompleted(id);
            return ResponseEntity.ok(ApiResponse.ok("Follow-up marked as completed", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * GET /api/admin/inquiries/{id}/private-notes
     */
    @GetMapping("/{id}/private-notes")
    public ResponseEntity<ApiResponse<List<InquiryPrivateNoteResponse>>> getPrivateNotes(
            @PathVariable Long id,
            @RequestHeader(value = "X-Admin-User", required = false) String actorUsername) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(inquiryService.getPrivateNotes(id, actorUsername)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * POST /api/admin/inquiries/{id}/private-notes
     */
    @org.springframework.web.bind.annotation.PostMapping("/{id}/private-notes")
    public ResponseEntity<ApiResponse<InquiryPrivateNoteResponse>> addPrivateNote(
            @PathVariable Long id,
            @RequestHeader(value = "X-Admin-User", required = false) String actorUsername,
            @RequestBody InquiryPrivateNoteRequest request) {
        try {
            InquiryPrivateNoteResponse saved = inquiryService.addPrivateNote(id, actorUsername, request.getContent());
            return ResponseEntity.ok(ApiResponse.ok("Private note added", saved));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * PATCH /api/admin/inquiries/{id}/private-notes/{noteId}
     */
    @PatchMapping("/{id}/private-notes/{noteId}")
    public ResponseEntity<ApiResponse<InquiryPrivateNoteResponse>> updatePrivateNote(
            @PathVariable Long id,
            @PathVariable Long noteId,
            @RequestHeader(value = "X-Admin-User", required = false) String actorUsername,
            @RequestBody InquiryPrivateNoteRequest request) {
        try {
            InquiryPrivateNoteResponse updated = inquiryService.updatePrivateNote(id, noteId, actorUsername,
                    request.getContent());
            return ResponseEntity.ok(ApiResponse.ok("Private note updated", updated));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * DELETE /api/admin/inquiries/{id}/private-notes/{noteId}
     */
    @DeleteMapping("/{id}/private-notes/{noteId}")
    public ResponseEntity<ApiResponse<Void>> deletePrivateNote(
            @PathVariable Long id,
            @PathVariable Long noteId,
            @RequestHeader(value = "X-Admin-User", required = false) String actorUsername) {
        try {
            inquiryService.deletePrivateNote(id, noteId, actorUsername);
            return ResponseEntity.ok(ApiResponse.ok("Private note deleted", null));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }
}
