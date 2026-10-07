package com.whisperledger.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaint_supports")
public class ComplaintSupport {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "complaint_id", nullable = false, length = 64)
    private String complaintId;

    @Column(name = "supporter_id", nullable = false, length = 128)
    private String supporterId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ComplaintSupport() {}

    public ComplaintSupport(String id, String complaintId, String supporterId) {
        this.id = id;
        this.complaintId = complaintId;
        this.supporterId = supporterId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getComplaintId() { return complaintId; }
    public void setComplaintId(String complaintId) { this.complaintId = complaintId; }

    public String getSupporterId() { return supporterId; }
    public void setSupporterId(String supporterId) { this.supporterId = supporterId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
