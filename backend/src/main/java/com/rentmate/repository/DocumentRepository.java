package com.rentmate.repository;

import com.rentmate.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByLeaseId(Long leaseId);
    List<Document> findByUploadedById(Long userId);
    List<Document> findByDocumentType(Document.DocumentType documentType);
}

