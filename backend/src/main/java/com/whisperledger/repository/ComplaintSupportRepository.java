package com.whisperledger.repository;

import com.whisperledger.entity.ComplaintSupport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ComplaintSupportRepository extends JpaRepository<ComplaintSupport, String> {
    Optional<ComplaintSupport> findByComplaintIdAndSupporterId(String complaintId, String supporterId);
    boolean existsByComplaintIdAndSupporterId(String complaintId, String supporterId);
    long countByComplaintId(String complaintId);
}
