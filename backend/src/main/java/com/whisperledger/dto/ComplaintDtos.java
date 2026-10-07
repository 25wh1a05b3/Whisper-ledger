package com.whisperledger.dto;

import com.whisperledger.entity.Complaint;
import java.time.LocalDateTime;

public class ComplaintDtos {

    public static class CreateComplaintRequest {
        private String title;
        private String description;
        private String category;
        private String department;
        private String year;
        private Complaint.Priority priority;

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
        public Complaint.Priority getPriority() { return priority; }
        public void setPriority(Complaint.Priority priority) { this.priority = priority; }
    }

    public static class StatusUpdateRequest {
        private Complaint.Status status;
        private Complaint.Priority priority;
        private String remarks;

        public Complaint.Status getStatus() { return status; }
        public void setStatus(Complaint.Status status) { this.status = status; }
        public Complaint.Priority getPriority() { return priority; }
        public void setPriority(Complaint.Priority priority) { this.priority = priority; }
        public String getRemarks() { return remarks; }
        public void setRemarks(String remarks) { this.remarks = remarks; }
    }

    public static class ChatMessageRequest {
        private String complaintId;
        private String message;

        public String getComplaintId() { return complaintId; }
        public void setComplaintId(String complaintId) { this.complaintId = complaintId; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class ComplaintResponse {
        private String id;
        private String title;
        private String description;
        private String category;
        private String department;
        private String year;
        private String status;
        private String priority;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private String anonymousId;
        private Integer supportCount;
        private String blockHash;
        private String previousHash;
        private String resolutionRemarks;

        public static ComplaintResponse fromEntity(Complaint c) {
            ComplaintResponse res = new ComplaintResponse();
            res.id = c.getId();
            res.title = c.getTitle();
            res.description = c.getDescription();
            res.category = c.getCategory();
            res.department = c.getDepartment();
            res.year = c.getYear();
            res.status = c.getStatus().name();
            res.priority = c.getPriority().name();
            res.createdAt = c.getCreatedAt();
            res.updatedAt = c.getUpdatedAt();
            res.anonymousId = c.getAnonymousId();
            res.supportCount = c.getSupportCount();
            res.blockHash = c.getBlockHash();
            res.previousHash = c.getPreviousHash();
            res.resolutionRemarks = c.getResolutionRemarks();
            return res;
        }

        // Getters
        public String getId() { return id; }
        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public String getCategory() { return category; }
        public String getDepartment() { return department; }
        public String getYear() { return year; }
        public String getStatus() { return status; }
        public String getPriority() { return priority; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public String getAnonymousId() { return anonymousId; }
        public Integer getSupportCount() { return supportCount; }
        public String getBlockHash() { return blockHash; }
        public String getPreviousHash() { return previousHash; }
        public String getResolutionRemarks() { return resolutionRemarks; }
    }
}
