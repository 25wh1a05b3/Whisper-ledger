package com.whisperledger.repository;

import com.whisperledger.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, String> {
    Optional<Complaint> findByAnonymousId(String anonymousId);
    List<Complaint> findByStudentSaltHash(String studentSaltHash);
    List<Complaint> findByCategory(String category);
    List<Complaint> findByDepartment(String department);
    List<Complaint> findByStatus(Complaint.Status status);
    
    @Query("SELECT c FROM Complaint c WHERE c.status NOT IN ('RESOLVED', 'CLOSED') AND c.createdAt <= :threshold")
    List<Complaint> findPendingOlderThan(LocalDateTime threshold);

    long countByStatus(Complaint.Status status);
}
