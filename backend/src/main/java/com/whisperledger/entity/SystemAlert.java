package com.whisperledger.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "system_alerts")
public class SystemAlert {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Complaint.Priority severity;

    @Column(name = "cluster_category", nullable = false, length = 60)
    private String clusterCategory;

    @Column(name = "complaint_count", nullable = false)
    private Integer complaintCount = 1;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public SystemAlert() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Complaint.Priority getSeverity() { return severity; }
    public void setSeverity(Complaint.Priority severity) { this.severity = severity; }

    public String getClusterCategory() { return clusterCategory; }
    public void setClusterCategory(String clusterCategory) { this.clusterCategory = clusterCategory; }

    public Integer getComplaintCount() { return complaintCount; }
    public void setComplaintCount(Integer complaintCount) { this.complaintCount = complaintCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
