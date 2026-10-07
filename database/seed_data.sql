-- Sample Demo Data for Whisper Ledger
USE whisper_ledger;

-- Default Users (Section 10 Demo Accounts & Legacy Accounts)
INSERT INTO users (id, name, email, department, year, password, role) VALUES
('u-demo-std', 'Alex Chen', 'student@whisperledger.local', 'Computer Science', '3rd Year', '$2a$10$7Z8l/j8tC2n9cR...Student@123', 'STUDENT'),
('u-demo-hod', 'Dr. Ramesh Kumar (HOD CSE)', 'hod@whisperledger.local', 'Computer Science', 'Faculty', '$2a$10$7Z8l/j8tC2n9cR...Admin@123', 'HOD'),
('u-demo-dean', 'Prof. Sunita Deshmukh', 'dean@whisperledger.local', 'Administration', 'Executive', '$2a$10$7Z8l/j8tC2n9cR...Admin@123', 'DEAN'),
('u-demo-comm', 'Grievance Committee', 'committee@whisperledger.local', 'Oversight', 'Executive', '$2a$10$7Z8l/j8tC2n9cR...Admin@123', 'GRIEVANCE_COMMITTEE'),
('u-demo-adm', 'System Administrator', 'admin@whisperledger.local', 'IT & Security', 'Admin', '$2a$10$7Z8l/j8tC2n9cR...Admin@123', 'ADMIN'),
('u-std-1', 'Aarav Patel', 'student@campus.edu', 'Computer Science', '3rd Year', '$2a$10$7Z8l/j8tC2n9cR...student123', 'STUDENT'),
('u-hod-1', 'Dr. Ramesh Raman (HOD CSE)', 'hod.cse@campus.edu', 'Computer Science', 'Faculty', '$2a$10$7Z8l/j8tC2n9cR...admin123', 'HOD'),
('u-dean-1', 'Prof. Sunita Deshmukh', 'dean@campus.edu', 'Administration', 'Executive', '$2a$10$7Z8l/j8tC2n9cR...admin123', 'DEAN'),
('u-comm-1', 'Grievance Committee', 'committee@campus.edu', 'Oversight', 'Executive', '$2a$10$7Z8l/j8tC2n9cR...admin123', 'GRIEVANCE_COMMITTEE'),
('u-admin-1', 'System Administrator', 'admin@campus.edu', 'IT & Security', 'Admin', '$2a$10$7Z8l/j8tC2n9cR...admin123', 'ADMIN')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Demo Complaints
INSERT INTO complaints (id, title, description, category, department, year, status, priority, anonymous_id, student_salt_hash, support_count, block_hash, previous_hash) VALUES
('cmp-001', 'Hostel Water Issue - Contamination in Block B', 'Water in 3rd & 4th floors running brown. Multiple students unwell with stomach infections.', 'Hostel', 'Hostel Administration', '2nd Year', 'UNDER_REVIEW', 'HIGH', 'ANON-HOST-8941', 'salt_hash_1', 38, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', '0000000000000000000abcdef987654321fedcba0123456789abcdef01234567'),
('cmp-002', 'Campus WiFi Down in Central Library and CSE Labs', 'Eduroam disconnected intermittently every 3 minutes. Disables assignment submissions.', 'Infrastructure', 'Computer Science', '3rd Year', 'IN_PROGRESS', 'MEDIUM', 'ANON-CSE-4120', 'salt_hash_2', 54, '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'),
('cmp-003', 'Severe Ragging and Intimidation at Junior Boys Dining Hall', 'Seniors forcing juniors to stand outside after 11:30 PM and extorting money.', 'Ragging', 'Mechanical Engineering', '1st Year', 'ESCALATED', 'CRITICAL', 'ANON-MECH-9012', 'salt_hash_3', 42, 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d', '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'),
('cmp-004', 'Unsafe Staircase Railing Loose in Old Science Block C', 'Metal railing detached from wall. A student slipped yesterday in rain.', 'Safety', 'Civil Engineering', 'All Years', 'RESOLVED', 'HIGH', 'ANON-CIVL-3341', 'salt_hash_4', 29, '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d'),
('cmp-005', 'Faculty Harassment and Discriminatory Internal Marks Deductions', 'Lecturer threatens failing internal grades if personal errands not performed.', 'Faculty Issue', 'Electrical Engineering', '3rd Year', 'ESCALATED', 'CRITICAL', 'ANON-EEE-7721', 'salt_hash_5', 67, '86f7e437faa5a7fce15d1ddcb9eaeaea377667b8aafcd4e6220cd3e4ab9902ff', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Demo System Alerts
INSERT INTO system_alerts (id, title, description, severity, cluster_category, complaint_count) VALUES
('alt-1', 'Recurring Hostel Infrastructure Issue Detected', '38 students supported grievances regarding Block B water filtration.', 'HIGH', 'Hostel', 38),
('alt-2', 'High Severity Pattern: Hostile Academic Environment', '67 endorsements logged for evaluation opacity in EE Department.', 'CRITICAL', 'Faculty Issue', 67)
ON DUPLICATE KEY UPDATE title=VALUES(title);
