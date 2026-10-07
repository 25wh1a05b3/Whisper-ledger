package com.whisperledger.controller;

import com.whisperledger.dto.ComplaintDtos.ChatMessageRequest;
import com.whisperledger.entity.Complaint;
import com.whisperledger.entity.ComplaintMessage;
import com.whisperledger.entity.User;
import com.whisperledger.repository.ComplaintMessageRepository;
import com.whisperledger.repository.ComplaintRepository;
import com.whisperledger.security.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ComplaintMessageRepository messageRepository;
    private final ComplaintRepository complaintRepository;
    private final JwtUtil jwtUtil;

    public ChatController(ComplaintMessageRepository messageRepository, ComplaintRepository complaintRepository, JwtUtil jwtUtil) {
        this.messageRepository = messageRepository;
        this.complaintRepository = complaintRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/{complaintId}")
    public ResponseEntity<List<ComplaintMessage>> getMessages(@PathVariable String complaintId) {
        return ResponseEntity.ok(messageRepository.findByComplaintIdOrderByCreatedAtAsc(complaintId));
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ChatMessageRequest request) {

        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtUtil.extractClaims(token);
        String roleStr = (String) claims.get("role");
        User.Role role = User.Role.valueOf(roleStr);

        Complaint complaint = complaintRepository.findById(request.getComplaintId())
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        String displayName = (role == User.Role.STUDENT) ? "Anonymous Student" : role.name() + " Official";

        ComplaintMessage message = new ComplaintMessage();
        message.setId("msg-" + UUID.randomUUID().toString().substring(0, 8));
        message.setComplaintId(request.getComplaintId());
        message.setSenderRole(role);
        message.setSenderDisplayName(displayName);
        message.setMessage(request.getMessage());
        message.setIsOfficialNotice(role != User.Role.STUDENT);

        ComplaintMessage saved = messageRepository.save(message);
        return ResponseEntity.ok(saved);
    }
}
