package com.whisperledger.controller;

import com.whisperledger.entity.Complaint;
import com.whisperledger.repository.ComplaintRepository;
import com.whisperledger.repository.SystemAlertRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AdminController {

    private final ComplaintRepository complaintRepository;
    private final SystemAlertRepository systemAlertRepository;

    public AdminController(ComplaintRepository complaintRepository, SystemAlertRepository systemAlertRepository) {
        this.complaintRepository = complaintRepository;
        this.systemAlertRepository = systemAlertRepository;
    }

    @GetMapping("/admin/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        long total = complaintRepository.count();
        long open = complaintRepository.countByStatus(Complaint.Status.SUBMITTED) + complaintRepository.countByStatus(Complaint.Status.UNDER_REVIEW);
        long inProgress = complaintRepository.countByStatus(Complaint.Status.IN_PROGRESS);
        long escalated = complaintRepository.countByStatus(Complaint.Status.ESCALATED);
        long resolved = complaintRepository.countByStatus(Complaint.Status.RESOLVED) + complaintRepository.countByStatus(Complaint.Status.CLOSED);

        Map<String, Object> response = new HashMap<>();
        response.put("totalComplaints", total);
        response.put("openComplaints", open);
        response.put("inProgressComplaints", inProgress);
        response.put("escalatedComplaints", escalated);
        response.put("resolvedComplaints", resolved);
        response.put("activeAlerts", systemAlertRepository.findTop10ByOrderByCreatedAtDesc());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics() {
        List<Complaint> complaints = complaintRepository.findAll();
        Map<String, Long> categoryStats = new HashMap<>();
        Map<String, Long> departmentStats = new HashMap<>();

        for (Complaint c : complaints) {
            categoryStats.put(c.getCategory(), categoryStats.getOrDefault(c.getCategory(), 0L) + 1);
            departmentStats.put(c.getDepartment(), departmentStats.getOrDefault(c.getDepartment(), 0L) + 1);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("categoryStats", categoryStats);
        data.put("departmentStats", departmentStats);
        data.put("totalRecords", complaints.size());
        return ResponseEntity.ok(data);
    }
}
