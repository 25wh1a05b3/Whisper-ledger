package com.whisperledger.repository;

import com.whisperledger.entity.SystemAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SystemAlertRepository extends JpaRepository<SystemAlert, String> {
    List<SystemAlert> findTop10ByOrderByCreatedAtDesc();
}
