package com.g25.selfcalendar.repository;

import com.g25.selfcalendar.entity.RecurringInterval;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecurringIntervalRepository extends JpaRepository<RecurringInterval, Long> {
}
