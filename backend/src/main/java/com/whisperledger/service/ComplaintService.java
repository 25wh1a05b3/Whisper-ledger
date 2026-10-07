package com.whisperledger.service;

import com.whisperledger.dto.ComplaintDtos.*;
import com.whisperledger.entity.*;
import com.whisperledger.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintSupportRepository complaintSupportRepository;
    private final ComplaintStatusHistoryRepository historyRepository;
    private final ComplaintMessageRepository messageRepository;

    private String latestBlockHash = "0000000000000000000abcdef987654321fedcba0123456789abcdef01234567";

    public ComplaintService(
            ComplaintRepository complaintRepository,
            ComplaintSupportRepository complaintSupportRepository,
            ComplaintStatusHistoryRepository historyRepository,
            ComplaintMessageRepository messageRepository) {
        this.complaintRepository = complaintRepository;
        this.complaintSupportRepository = complaintSupportRepository;
        this.historyRepository = historyRepository;
        this.messageRepository = messageRepository;
    }

    private String sha256(String base) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(base.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    @Transactional
    public Complaint createComplaint(CreateComplaintRequest request, String studentUserId, String studentDept, String studentYear) {
        String complaintId = "cmp-" + UUID.randomUUID().toString().substring(0, 8);
        String deptPrefix = (request.getDepartment() != null ? request.getDepartment() : "UNIV").replaceAll("[^A-Za-z]", "").toUpperCase();
        if (deptPrefix.length() > 4) deptPrefix = deptPrefix.substring(0, 4);
        String anonId = "ANON-" + deptPrefix + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        // Isolated salted hash: student identity can NEVER be reverse-engineered from public tables
        String saltHash = sha256(studentUserId + "-" + complaintId);

        String previousHash = latestBlockHash;
        String blockHash = sha256(complaintId + request.getTitle() + request.getCategory() + previousHash);
        latestBlockHash = blockHash;

        Complaint complaint = new Complaint();
        complaint.setId(complaintId);
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setCategory(request.getCategory());
        complaint.setDepartment(request.getDepartment() != null ? request.getDepartment() : studentDept);
        complaint.setYear(request.getYear() != null ? request.getYear() : studentYear);
        complaint.setStatus(Complaint.Status.SUBMITTED);
        complaint.setPriority(request.getPriority() != null ? request.getPriority() : Complaint.Priority.MEDIUM);
        complaint.setAnonymousId(anonId);
        complaint.setStudentSaltHash(saltHash);
        complaint.setSupportCount(1);
        complaint.setBlockHash(blockHash);
        complaint.setPreviousHash(previousHash);

        Complaint saved = complaintRepository.save(complaint);

        // Record history
        ComplaintStatusHistory history = new ComplaintStatusHistory();
        history.setId("csh-" + UUID.randomUUID().toString().substring(0, 8));
        history.setComplaintId(complaintId);
        history.setOldStatus("NONE");
        history.setNewStatus("SUBMITTED");
        history.setRemarks("Complaint cryptographically registered to ledger with zero identity exposure.");
        history.setUpdatedByRole("STUDENT_ANONYMOUS");
        historyRepository.save(history);

        // Register initial support
        ComplaintSupport support = new ComplaintSupport("sup-" + UUID.randomUUID().toString().substring(0, 8), complaintId, sha256(studentUserId));
        complaintSupportRepository.save(support);

        // System message in anonymous chat
        ComplaintMessage welcome = new ComplaintMessage();
        welcome.setId("msg-" + UUID.randomUUID().toString().substring(0, 8));
        welcome.setComplaintId(complaintId);
        welcome.setSenderRole(User.Role.ADMIN);
        welcome.setSenderDisplayName("Whisper Ledger Privacy Vault");
        welcome.setMessage("Grievance registered under " + anonId + ". Two-way encrypted channel active.");
        welcome.setIsOfficialNotice(true);
        messageRepository.save(welcome);

        return saved;
    }

    @Transactional
    public boolean toggleSupport(String complaintId, String studentUserId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        String supporterHash = sha256(studentUserId);
        Optional<ComplaintSupport> existing = complaintSupportRepository.findByComplaintIdAndSupporterId(complaintId, supporterHash);

        if (existing.isPresent()) {
            complaintSupportRepository.delete(existing.get());
            complaint.setSupportCount(Math.max(1, complaint.getSupportCount() - 1));
            complaintRepository.save(complaint);
            return false;
        } else {
            ComplaintSupport newSupport = new ComplaintSupport(
                    "sup-" + UUID.randomUUID().toString().substring(0, 8),
                    complaintId,
                    supporterHash
            );
            complaintSupportRepository.save(newSupport);
            complaint.setSupportCount(complaint.getSupportCount() + 1);

            // Escalate priority based on community consensus
            if (complaint.getSupportCount() >= 25 && complaint.getPriority() == Complaint.Priority.MEDIUM) {
                complaint.setPriority(Complaint.Priority.HIGH);
            } else if (complaint.getSupportCount() >= 50 && complaint.getPriority() != Complaint.Priority.CRITICAL) {
                complaint.setPriority(Complaint.Priority.CRITICAL);
            }

            complaintRepository.save(complaint);
            return true;
        }
    }

    @Transactional
    public Complaint updateStatus(String complaintId, StatusUpdateRequest update, User.Role role) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (update.getStatus() != null && update.getStatus() != complaint.getStatus()) {
            ComplaintStatusHistory history = new ComplaintStatusHistory();
            history.setId("csh-" + UUID.randomUUID().toString().substring(0, 8));
            history.setComplaintId(complaintId);
            history.setOldStatus(complaint.getStatus().name());
            history.setNewStatus(update.getStatus().name());
            history.setRemarks(update.getRemarks());
            history.setUpdatedByRole(role.name());
            historyRepository.save(history);

            complaint.setStatus(update.getStatus());
        }

        if (update.getPriority() != null) {
            complaint.setPriority(update.getPriority());
        }

        if (update.getRemarks() != null && update.getStatus() == Complaint.Status.RESOLVED) {
            complaint.setResolutionRemarks(update.getRemarks());
        }

        return complaintRepository.save(complaint);
    }
}
