package com.whisperledger.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaint_status_history")
public class ComplaintStatusHistory {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "complaint_id", nullable = false, length = 64)
    private String complaintId;

    @Column(name = "old_status", nullable = false, length = 50)
    private String oldStatus;

    @Column(name = "new_status", nullable = false, length = 50)
    private String newStatus;

    @Column(length = 500)
    private String remarks;

    @Column(name = "updated_by_role", nullable = false, length = 50)
    private String updatedByRole;

    @Column(name = "updated_at", updatable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public ComplaintStatusHistory() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getComplaintId() { return complaintId; }
    public void setComplaintId(String complaintId) { this.complaintId = complaintId; }

    public String getOldStatus() { return oldStatus; }
    public void setOldStatus(String oldStatus) { this.oldStatus = oldStatus; }

    public String getNewStatus() { return newStatus; }
    public void setNewStatus(String newStatus) { this.newStatus = newStatus; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getUpdatedByRole() { return updatedByRole; }
    public void setUpdatedByRole(String updatedByRole) { this.updatedByRole = updatedByRole; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
