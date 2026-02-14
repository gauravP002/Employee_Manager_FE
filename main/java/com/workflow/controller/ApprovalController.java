package com.workflow.controller;

import com.workflow.dto.TaskResponse;
import com.workflow.dto.UserDto;
import com.workflow.entity.Status;
import com.workflow.entity.Task;
import com.workflow.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/approvals")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MANAGER')")
public class ApprovalController {

    private final TaskRepository taskRepository;

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getPendingApprovals() {
        List<TaskResponse> pending = taskRepository.findAll().stream()
                .filter(t -> t.getStatus() == Status.SUBMITTED)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(pending);
    }

    @PostMapping("/{taskId}/approve")
    public ResponseEntity<Void> approveTask(@PathVariable Long taskId) {
        return taskRepository.findById(taskId)
                .map(task -> {
                    task.setStatus(Status.APPROVED);
                    taskRepository.save(task);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{taskId}/reject")
    public ResponseEntity<Void> rejectTask(@PathVariable Long taskId) {
        return taskRepository.findById(taskId)
                .map(task -> {
                    task.setStatus(Status.REJECTED);
                    taskRepository.save(task);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .createdBy(UserDto.builder()
                        .id(task.getCreatedBy().getId())
                        .name(task.getCreatedBy().getName())
                        .email(task.getCreatedBy().getEmail())
                        .role(task.getCreatedBy().getRole())
                        .build())
                .build();
    }
}
