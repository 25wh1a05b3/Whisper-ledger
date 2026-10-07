package com.whisperledger.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 60)
    private String category;

    @Column(nullable = false, length = 100)
    private String department;

    @Column(nullable = false, length = 50)
    private String year;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status = Status.SUBMITTED;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Priority priority = Priority.MEDIUM;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "anonymous_id", nullable = false, unique = true, length = 50)
    private String anonymousId;

    @Column(name = "student_salt_hash", nullable = false, length = 128)
    private String studentSaltHash;

    @Column(name = "support_count", nullable = false)
    private Integer supportCount = 1;

    @Column(name = "block_hash", nullable = false, length = 128)
    private String blockHash;

    @Column(name = "previous_hash", nullable = false, length = 128)
    private String previousHash;

    @Column(name = "resolution_remarks", columnDefinition = "TEXT")
    private String resolutionRemarks;

    public enum Status {
        SUBMITTED,
        UNDER_REVIEW,
        IN_PROGRESS,
        ESCALATED,
        RESOLVED,
        CLOSED
    }

    public enum Priority {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }

    public Complaint() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getAnonymousId() { return anonymousId; }
    public void setAnonymousId(String anonymousId) { this.anonymousId = anonymousId; }

    public String getStudentSaltHash() { return studentSaltHash; }
    public void setStudentSaltHash(String studentSaltHash) { this.studentSaltHash = studentSaltHash; }

    public Integer getSupportCount() { return supportCount; }
    public void setSupportCount(Integer supportCount) { this.supportCount = supportCount; }

    public String getBlockHash() { return blockHash; }
    public void setBlockHash(String blockHash) { this.blockHash = blockHash; }

    public String getPreviousHash() { return previousHash; }
    public void setPreviousHash(String previousHash) { this.previousHash = previousHash; }

    public String getResolutionRemarks() { return resolutionRemarks; }
    public void setResolutionRemarks(String resolutionRemarks) { this.resolutionRemarks = resolutionRemarks; }
}
