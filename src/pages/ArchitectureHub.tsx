import React, { useState } from 'react';
import {
  Code2,
  Database,
  FileCode,
  FolderTree,
  Copy,
  Check,
  Terminal,
  Server,
  Layers,
  Shield,
  BookOpen,
} from 'lucide-react';

export const ArchitectureHub: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('Complaint.java');
  const [copied, setCopied] = useState<boolean>(false);

  const fileContents: Record<string, { language: string; content: string; desc: string }> = {
    'DirectoryStructure.txt': {
      language: 'text',
      desc: 'Complete full-stack repository structure',
      content: `whisper-ledger/
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/whisperledger/
│           │   ├── WhisperLedgerApplication.java
│           │   ├── entity/
│           │   │   ├── User.java
│           │   │   ├── Complaint.java
│           │   │   ├── ComplaintSupport.java
│           │   │   ├── ComplaintMessage.java
│           │   │   ├── ComplaintStatusHistory.java
│           │   │   ├── EscalationLog.java
│           │   │   └── SystemAlert.java
│           │   ├── repository/
│           │   │   ├── UserRepository.java
│           │   │   ├── ComplaintRepository.java
│           │   │   ├── ComplaintSupportRepository.java
│           │   │   ├── ComplaintMessageRepository.java
│           │   │   ├── ComplaintStatusHistoryRepository.java
│           │   │   ├── EscalationLogRepository.java
│           │   │   └── SystemAlertRepository.java
│           │   ├── service/
│           │   │   ├── ComplaintService.java
│           │   │   ├── EscalationEngineService.java
│           │   │   └── AiClusteringService.java
│           │   ├── controller/
│           │   │   ├── AuthController.java
│           │   │   ├── ComplaintController.java
│           │   │   ├── ChatController.java
│           │   │   └── AdminController.java
│           │   ├── security/
│           │   │   ├── JwtUtil.java
│           │   │   ├── JwtAuthenticationFilter.java
│           │   │   └── SecurityConfig.java
│           │   ├── dto/
│           │   │   ├── AuthDtos.java
│           │   │   └── ComplaintDtos.java
│           │   └── config/
│           │       └── CorsConfig.java
│           └── resources/
│               └── application.yml
├── database/
│   ├── schema.sql
│   └── seed_data.sql
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── server.ts
    └── src/
        ├── components/
        │   ├── Navbar.tsx
        │   ├── Footer.tsx
        │   ├── StudentCanvasBackground.tsx
        │   ├── ComplaintCard.tsx
        │   ├── StatusBadge.tsx
        │   └── PrivacyShieldModal.tsx
        ├── pages/
        │   ├── Home.tsx
        │   ├── StudentDashboard.tsx
        │   ├── AdminDashboard.tsx
        │   ├── ComplaintDetails.tsx
        │   ├── AnalyticsDashboard.tsx
        │   └── ArchitectureHub.tsx
        ├── context/
        │   └── AuthContext.tsx
        ├── services/
        │   └── api.ts
        └── types/
            └── index.ts`,
    },

    'Complaint.java': {
      language: 'java',
      desc: 'JPA Entity with Cryptographic SHA-256 Ledger Fields and Salt Hash',
      content: `package com.whisperledger.entity;

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

    // Zero-Identity public pseudonym (e.g. ANON-HOST-8941)
    @Column(name = "anonymous_id", nullable = false, unique = true, length = 50)
    private String anonymousId;

    // Salted hash for student author verification; actual user id NEVER stored
    @Column(name = "student_salt_hash", nullable = false, length = 128)
    private String studentSaltHash;

    @Column(name = "support_count", nullable = false)
    private Integer supportCount = 1;

    // Tamper-proof block chain
    @Column(name = "block_hash", nullable = false, length = 128)
    private String blockHash;

    @Column(name = "previous_hash", nullable = false, length = 128)
    private String previousHash;

    @Column(name = "resolution_remarks", columnDefinition = "TEXT")
    private String resolutionRemarks;

    public enum Status {
        SUBMITTED, UNDER_REVIEW, IN_PROGRESS, ESCALATED, RESOLVED, CLOSED
    }

    public enum Priority {
        LOW, MEDIUM, HIGH, CRITICAL
    }
}`,
    },

    'EscalationEngineService.java': {
      language: 'java',
      desc: 'Automated 7/14/21 Day Time-Based SLA Escalation Engine with Audit Logging',
      content: `package com.whisperledger.service;

import com.whisperledger.entity.*;
import com.whisperledger.repository.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class EscalationEngineService {

    private final ComplaintRepository complaintRepository;
    private final EscalationLogRepository escalationLogRepository;
    private final ComplaintStatusHistoryRepository historyRepository;

    public EscalationEngineService(
            ComplaintRepository complaintRepository,
            EscalationLogRepository escalationLogRepository,
            ComplaintStatusHistoryRepository historyRepository) {
        this.complaintRepository = complaintRepository;
        this.escalationLogRepository = escalationLogRepository;
        this.historyRepository = historyRepository;
    }

    // Cron job to automatically escalate dormant grievances daily
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void executeAutomaticEscalation() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Complaint> pending = complaintRepository.findPendingOlderThan(sevenDaysAgo);

        for (Complaint complaint : pending) {
            long daysPending = Duration.between(complaint.getCreatedAt(), LocalDateTime.now()).toDays();

            String targetRole;
            String tierLevel;

            // Strict SLA Thresholds
            if (daysPending >= 21) {
                targetRole = "GRIEVANCE_COMMITTEE";
                tierLevel = "TIER-3 (Campus Grievance Redressal Committee)";
            } else if (daysPending >= 14) {
                targetRole = "DEAN";
                tierLevel = "TIER-2 (Dean Student Welfare)";
            } else {
                targetRole = "HOD";
                tierLevel = "TIER-1 (Head of Department)";
            }

            if (complaint.getStatus() != Complaint.Status.ESCALATED) {
                complaint.setStatus(Complaint.Status.ESCALATED);
                complaintRepository.save(complaint);

                // Immutable escalation log
                EscalationLog log = new EscalationLog();
                log.setId("esc-" + UUID.randomUUID().toString().substring(0, 8));
                log.setComplaintId(complaint.getId());
                log.setCurrentLevel(tierLevel);
                log.setEscalatedTo(targetRole);
                log.setReason("Pending for " + daysPending + " days without resolution. SLA breach trigger.");
                escalationLogRepository.save(log);

                // Status history update
                ComplaintStatusHistory history = new ComplaintStatusHistory();
                history.setId("csh-" + UUID.randomUUID().toString().substring(0, 8));
                history.setComplaintId(complaint.getId());
                history.setOldStatus("UNDER_REVIEW");
                history.setNewStatus("ESCALATED");
                history.setRemarks("Automatic SLA Escalation to " + tierLevel);
                history.setUpdatedByRole("ESCALATION_ENGINE");
                historyRepository.save(history);
            }
        }
    }
}`,
    },

    'ComplaintController.java': {
      language: 'java',
      desc: 'REST API Controller handling Anonymous Submissions, Me-Too & Status Changes',
      content: `package com.whisperledger.controller;

import com.whisperledger.dto.ComplaintDtos.*;
import com.whisperledger.entity.Complaint;
import com.whisperledger.entity.User;
import com.whisperledger.repository.ComplaintRepository;
import com.whisperledger.security.JwtUtil;
import com.whisperledger.service.ComplaintService;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;
    private final ComplaintRepository complaintRepository;
    private final JwtUtil jwtUtil;

    public ComplaintController(ComplaintService complaintService, ComplaintRepository complaintRepository, JwtUtil jwtUtil) {
        this.complaintService = complaintService;
        this.complaintRepository = complaintRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<?> submitComplaint(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateComplaintRequest request) {

        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtUtil.extractClaims(token);
        String userId = (String) claims.get("userId");
        String department = (String) claims.get("department");

        // Identity scrubbed: student ID is hashed and never returned in responses
        Complaint created = complaintService.createComplaint(request, userId, department, "3rd Year");
        return ResponseEntity.ok(ComplaintResponse.fromEntity(created));
    }

    @PostMapping("/{id}/support")
    public ResponseEntity<?> toggleSupport(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtUtil.extractClaims(token);
        String userId = (String) claims.get("userId");

        boolean supported = complaintService.toggleSupport(id, userId);
        return ResponseEntity.ok(java.util.Map.of("supported", supported));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody StatusUpdateRequest update) {

        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtUtil.extractClaims(token);
        User.Role role = User.Role.valueOf((String) claims.get("role"));

        Complaint updated = complaintService.updateStatus(id, update, role);
        return ResponseEntity.ok(ComplaintResponse.fromEntity(updated));
    }
}`,
    },

    'schema.sql': {
      language: 'sql',
      desc: 'Complete MySQL 8 Relational Schema matching Section 5',
      content: `CREATE DATABASE IF NOT EXISTS whisper_ledger;
USE whisper_ledger;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    year VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'HOD', 'DEAN', 'GRIEVANCE_COMMITTEE', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS complaints (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(60) NOT NULL,
    department VARCHAR(100) NOT NULL,
    year VARCHAR(50) NOT NULL,
    status ENUM('SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'ESCALATED', 'RESOLVED', 'CLOSED') NOT NULL DEFAULT 'SUBMITTED',
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    anonymous_id VARCHAR(50) NOT NULL UNIQUE,
    student_salt_hash VARCHAR(128) NOT NULL,
    support_count INT NOT NULL DEFAULT 1,
    block_hash VARCHAR(128) NOT NULL,
    previous_hash VARCHAR(128) NOT NULL,
    resolution_remarks TEXT NULL
);

CREATE TABLE IF NOT EXISTS complaint_supports (
    id VARCHAR(64) PRIMARY KEY,
    complaint_id VARCHAR(64) NOT NULL,
    supporter_id VARCHAR(128) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_complaint_supporter (complaint_id, supporter_id),
    CONSTRAINT fk_support_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS complaint_messages (
    id VARCHAR(64) PRIMARY KEY,
    complaint_id VARCHAR(64) NOT NULL,
    sender_role ENUM('STUDENT', 'HOD', 'DEAN', 'GRIEVANCE_COMMITTEE', 'ADMIN') NOT NULL,
    sender_display_name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_official_notice BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_message_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS complaint_status_history (
    id VARCHAR(64) PRIMARY KEY,
    complaint_id VARCHAR(64) NOT NULL,
    old_status VARCHAR(50) NOT NULL,
    new_status VARCHAR(50) NOT NULL,
    remarks VARCHAR(500) NULL,
    updated_by_role VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS escalation_logs (
    id VARCHAR(64) PRIMARY KEY,
    complaint_id VARCHAR(64) NOT NULL,
    current_level VARCHAR(60) NOT NULL,
    escalated_to VARCHAR(60) NOT NULL,
    reason TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_escalation_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS system_alerts (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
    cluster_category VARCHAR(60) NOT NULL,
    complaint_count INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
    },

    'SetupInstructions.md': {
      language: 'markdown',
      desc: 'Step-by-step Local & Production Deployment Guide',
      content: `# Whisper Ledger: Local & Production Setup

## 1. Database Setup (MySQL 8)
\`\`\`bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed_data.sql
\`\`\`

## 2. Spring Boot 3 Backend
### Requirements:
- Java 17+
- Maven 3.8+
- MySQL 8.0+ running on port 3306

### Run with Maven:
\`\`\`bash
cd backend
mvn clean install
mvn spring-boot:run
# Server starts on http://localhost:8080
\`\`\`

## 3. Frontend / Full-Stack Preview
### Requirements:
- Node.js 18+
- npm / yarn

### Run Development Server:
\`\`\`bash
npm install
npm run dev
# Running with full REST API & Vite on http://localhost:3000
\`\`\`

## 4. Default Demo Accounts
- **Student**: student@campus.edu / student123
- **HOD CSE**: hod.cse@campus.edu / admin123
- **Dean Welfare**: dean@campus.edu / admin123
- **Grievance Committee**: committee@campus.edu / admin123
- **System Admin**: admin@campus.edu / admin123`,
    },
  };

  const handleCopy = () => {
    const text = fileContents[selectedFile]?.content || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in py-2 relative z-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-700 font-bold uppercase tracking-wider">
            <Code2 className="w-4 h-4 text-amber-600" />
            <span>Architecture & Code Specifications (Section 19 & 21)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Spring Boot 3 + MySQL Implementation Codebase
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Explore the complete production Java 17, Spring Data JPA, Spring Security, and MySQL schema files.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-2xs self-start sm:self-auto"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Active File'}</span>
        </button>
      </div>

      {/* Main Code Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left File Selector */}
        <div className="lg:col-span-4 space-y-2">
          <div className="p-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 flex items-center gap-2 shadow-2xs">
            <FolderTree className="w-4 h-4 text-blue-600" />
            <span>Source Code Files</span>
          </div>

          <div className="space-y-1.5">
            {Object.keys(fileContents).map((fileName) => {
              const active = selectedFile === fileName;
              return (
                <button
                  key={fileName}
                  onClick={() => setSelectedFile(fileName)}
                  className={`w-full text-left p-3 rounded-2xl text-xs transition-colors flex items-start gap-2.5 ${
                    active
                      ? 'bg-blue-50 text-blue-900 border border-blue-200 font-semibold shadow-2xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <FileCode className={`w-4 h-4 mt-0.5 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="font-mono">{fileName}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                      {fileContents[fileName].desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Code Display */}
        <div className="lg:col-span-8 space-y-2">
          <div className="p-3 bg-white border border-slate-200 rounded-2xl text-xs flex items-center justify-between shadow-2xs">
            <span className="font-mono text-blue-700 font-bold">{selectedFile}</span>
            <span className="text-[11px] text-slate-500 font-medium">{fileContents[selectedFile]?.desc}</span>
          </div>

          <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-5 font-mono text-xs text-slate-200 overflow-x-auto max-h-[650px] overflow-y-auto leading-relaxed shadow-lg">
            <pre>
              <code>{fileContents[selectedFile]?.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
