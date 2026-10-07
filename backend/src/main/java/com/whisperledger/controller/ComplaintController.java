package com.whisperledger.controller;

import com.whisperledger.dto.ComplaintDtos.*;
import com.whisperledger.entity.Complaint;
import com.whisperledger.entity.User;
import com.whisperledger.repository.ComplaintRepository;
import com.whisperledger.repository.UserRepository;
import com.whisperledger.security.JwtUtil;
import com.whisperledger.service.ComplaintService;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public ComplaintController(
            ComplaintService complaintService,
            ComplaintRepository complaintRepository,
            UserRepository userRepository,
            JwtUtil jwtUtil) {
        this.complaintService = complaintService;
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<?> submitComplaint(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateComplaintRequest request) {

        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtUtil.extractClaims(token);
        String userId = (String) claims.get("userId");
        String department = (String) claims.get("department");

        Complaint created = complaintService.createComplaint(request, userId, department, "3rd Year");
        return ResponseEntity.ok(ComplaintResponse.fromEntity(created));
    }

    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints() {
        List<ComplaintResponse> list = complaintRepository.findAll().stream()
                .map(ComplaintResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getComplaintById(@PathVariable String id) {
        return complaintRepository.findById(id)
                .map(c -> ResponseEntity.ok(ComplaintResponse.fromEntity(c)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/support")
    public ResponseEntity<?> toggleSupport(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtUtil.extractClaims(token);
        String userId = (String) claims.get("userId");

        boolean supported = complaintService.toggleSupport(id, userId);
        return ResponseEntity.ok(java.util.Map.of("supported", supported));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody StatusUpdateRequest update) {

        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtUtil.extractClaims(token);
        String roleStr = (String) claims.get("role");
        User.Role role = User.Role.valueOf(roleStr);

        Complaint updated = complaintService.updateStatus(id, update, role);
        return ResponseEntity.ok(ComplaintResponse.fromEntity(updated));
    }
}
