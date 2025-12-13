package com.rentmate.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lease_id", nullable = false)
    private Lease lease;
    
    @NotBlank
    @Column(name = "file_name", nullable = false)
    private String fileName;
    
    @NotBlank
    @Column(name = "file_path", nullable = false)
    private String filePath;
    
    @Column(name = "file_type")
    private String fileType;
    
    @Column(name = "file_size")
    private Long fileSize;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false)
    private DocumentType documentType;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    public enum DocumentType {
        LEASE_AGREEMENT,
        INVOICE,
        RECEIPT,
        INSPECTION_REPORT,
        OTHER
    }
}

