package com.whisperledger.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "escalation_logs")
public class EscalationLog {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "complaint_id", nullable = false, length = 64)
    private String complaintId;

    @Column(name = "current_level", nullable = false, length = 60)
    private String currentLevel;

    @Column(name = "escalated_to", nullable = false, length = 60)
    private String escalatedTo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    public EscalationLog() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getComplaintId() { return complaintId; }
    public void setComplaintId(String complaintId) { this.complaintId = complaintId; }

    public String getCurrentLevel() { return currentLevel; }
    public void setCurrentLevel(String currentLevel) { this.currentLevel = currentLevel; }

    public String getEscalatedTo() { return escalatedTo; }
    public void setEscalatedTo(String escalatedTo) { this.escalatedTo = escalatedTo; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
