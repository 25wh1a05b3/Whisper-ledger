-- ========================================================
-- WHISPER LEDGER - DATABASE SCHEMA (MySQL 8+)
-- "Anonymous for Students, Accountable for Institutions"
-- ========================================================

CREATE DATABASE IF NOT EXISTS whisper_ledger CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE whisper_ledger;

-- 1. Users Table (Stores authenticated campus members)
-- Crucial Security Principle: Student IDs are NEVER referenced directly in public grievance tables.
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    year VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'HOD', 'DEAN', 'GRIEVANCE_COMMITTEE', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Complaints Table (Anonymized Ledger Records)
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
    resolution_remarks TEXT NULL,
    INDEX idx_complaint_status (status),
    INDEX idx_complaint_category (category),
    INDEX idx_complaint_dept (department),
    INDEX idx_complaint_anon_id (anonymous_id)
) ENGINE=InnoDB;

-- 3. Complaint Support ("Me Too" Endorsements)
CREATE TABLE IF NOT EXISTS complaint_supports (
    id VARCHAR(64) PRIMARY KEY,
    complaint_id VARCHAR(64) NOT NULL,
    supporter_id VARCHAR(128) NOT NULL, -- Hashed supporter key to prevent duplicate voting while preserving anonymity
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_complaint_supporter (complaint_id, supporter_id),
    CONSTRAINT fk_support_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Complaint Messages (Anonymous Two-Way Communication)
CREATE TABLE IF NOT EXISTS complaint_messages (
    id VARCHAR(64) PRIMARY KEY,
    complaint_id VARCHAR(64) NOT NULL,
    sender_role ENUM('STUDENT', 'HOD', 'DEAN', 'GRIEVANCE_COMMITTEE', 'ADMIN') NOT NULL,
    sender_display_name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_official_notice BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_message_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Complaint Status History (Audit Trail)
CREATE TABLE IF NOT EXISTS complaint_status_history (
    id VARCHAR(64) PRIMARY KEY,
    complaint_id VARCHAR(64) NOT NULL,
    old_status VARCHAR(50) NOT NULL,
    new_status VARCHAR(50) NOT NULL,
    remarks VARCHAR(500) NULL,
    updated_by_role VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Escalation Log (Automated Institutional SLA Tracking)
CREATE TABLE IF NOT EXISTS escalation_logs (
    id VARCHAR(64) PRIMARY KEY,
    complaint_id VARCHAR(64) NOT NULL,
    current_level VARCHAR(60) NOT NULL,
    escalated_to VARCHAR(60) NOT NULL,
    reason TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_escalation_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. System Alerts (AI Recurring Complaint Clusters)
CREATE TABLE IF NOT EXISTS system_alerts (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
    cluster_category VARCHAR(60) NOT NULL,
    complaint_count INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
