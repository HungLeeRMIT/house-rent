package com.rentmate.repository;

import com.rentmate.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderId(Long senderId);
    List<Message> findByRecipientId(Long recipientId);
    List<Message> findByRecipientIdAndIsReadFalse(Long recipientId);
}

