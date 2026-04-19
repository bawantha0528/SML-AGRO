package com.smlagro.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smlagro.model.InquiryPrivateNote;

@Repository
public interface InquiryPrivateNoteRepository extends JpaRepository<InquiryPrivateNote, Long> {

    List<InquiryPrivateNote> findByInquiryIdOrderByCreatedAtAsc(Long inquiryId);

    Optional<InquiryPrivateNote> findByIdAndInquiryId(Long id, Long inquiryId);
}
