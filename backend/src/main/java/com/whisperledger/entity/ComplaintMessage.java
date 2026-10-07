package com.whisperledger.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaint_messages")
public class ComplaintMessage {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "complaint_id", nullable = false, length = 64)
    private String complaintId;

    @Enumerated(EnumType.STRING)
    @Column(name = "sender_role", nullable = false, length = 30)
    private User.Role senderRole;

    @Column(name = "sender_display_name", nullable = false, length = 100)
    private String senderDisplayName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "is_official_notice")
    private Boolean isOfficialNotice = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ComplaintMessage() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getComplaintId() { return complaintId; }
    public void setComplaintId(String complaintId) { this.complaintId = complaintId; }

    public User.Role getSenderRole() { return senderRole; }
    public void setSenderRole(User.Role senderRole) { this.senderRole = senderRole; }

    public String getSenderDisplayName() { return senderDisplayName; }
    public void setSenderDisplayName(String senderDisplayName) { this.senderDisplayName = senderDisplayName; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Boolean getIsOfficialNotice() { return isOfficialNotice; }
    public void setIsOfficialNotice(Boolean isOfficialNotice) { this.isOfficialNotice = isOfficialNotice; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
