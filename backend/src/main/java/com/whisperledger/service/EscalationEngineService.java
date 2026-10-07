package com.whisperledger.service;

import com.whisperledger.entity.Complaint;
import com.whisperledger.entity.EscalationLog;
import com.whisperledger.entity.ComplaintStatusHistory;
import com.whisperledger.repository.ComplaintRepository;
import com.whisperledger.repository.EscalationLogRepository;
import com.whisperledger.repository.ComplaintStatusHistoryRepository;
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

    // Cron job to run automatic escalation daily at midnight
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void executeAutomaticEscalation() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Complaint> pending = complaintRepository.findPendingOlderThan(sevenDaysAgo);

        for (Complaint complaint : pending) {
            long daysPending = Duration.between(complaint.getCreatedAt(), LocalDateTime.now()).toDays();

            String targetRole;
            String tierLevel;

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
                String oldStatus = complaint.getStatus().name();
                complaint.setStatus(Complaint.Status.ESCALATED);
                complaintRepository.save(complaint);

                String reason = "Pending for " + daysPending + " days without resolution. SLA breach trigger.";

                EscalationLog log = new EscalationLog();
                log.setId("esc-" + UUID.randomUUID().toString().substring(0, 8));
                log.setComplaintId(complaint.getId());
                log.setCurrentLevel(tierLevel);
                log.setEscalatedTo(targetRole);
                log.setReason(reason);
                escalationLogRepository.save(log);

                ComplaintStatusHistory history = new ComplaintStatusHistory();
                history.setId("csh-" + UUID.randomUUID().toString().substring(0, 8));
                history.setComplaintId(complaint.getId());
                history.setOldStatus(oldStatus);
                history.setNewStatus("ESCALATED");
                history.setRemarks("Automatic SLA Escalation to " + tierLevel);
                history.setUpdatedByRole("ESCALATION_ENGINE");
                historyRepository.save(history);
            }
        }
    }
}
