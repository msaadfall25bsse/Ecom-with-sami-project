<div class="d-flex justify-content-between align-items-center mb-4">
    <h2>Manage Lessons</h2>
    <?php if(isset($data['selected_module'])): ?>
    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createLessonModal">Add New Lesson (Video)</button>
    <?php endif; ?>
</div>

<div class="row">
    <!-- Module Selector Sidebar -->
    <div class="col-md-3 mb-4">
        <div class="card shadow-sm">
            <div class="card-header bg-dark text-white fw-bold">Select Module</div>
            <div class="list-group list-group-flush">
                <?php if(isset($data['modules']) && count($data['modules']) > 0): ?>
                    <?php foreach($data['modules'] as $mod): ?>
                        <a href="<?= BASE_URL ?>/admin/lessons/<?= $mod['id'] ?>" class="list-group-item list-group-item-action <?= (isset($data['selected_module']) && $data['selected_module']['id'] == $mod['id']) ? 'active' : '' ?>">
                            <?= htmlspecialchars($mod['title']) ?>
                        </a>
                    <?php endforeach; ?>
                <?php else: ?>
                    <div class="list-group-item">No modules available. <a href="<?= BASE_URL ?>/admin/modules">Create one</a></div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <!-- Lessons List -->
    <div class="col-md-9">
        <div class="card shadow-sm">
            <div class="card-header bg-white fw-bold">
                Lessons in: <span class="text-primary"><?= isset($data['selected_module']) ? htmlspecialchars($data['selected_module']['title']) : 'Select a module' ?></span>
            </div>
            <div class="card-body p-0">
                <table class="table table-hover mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Order</th>
                            <th>Lesson Title</th>
                            <th>Bunny Video ID</th>
                            <th>Duration</th>
                            <th>Preview</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if(isset($data['lessons']) && count($data['lessons']) > 0): ?>
                            <?php foreach($data['lessons'] as $lesson): ?>
                            <tr>
                                <td><?= htmlspecialchars($lesson['sort_order']) ?></td>
                                <td><strong><?= htmlspecialchars($lesson['title']) ?></strong></td>
                                <td><code><?= htmlspecialchars($lesson['bunny_video_id']) ?></code></td>
                                <td><?= htmlspecialchars($lesson['duration']) ?></td>
                                <td><?= $lesson['is_preview'] ? '<span class="badge bg-success">Yes</span>' : '<span class="badge bg-secondary">No</span>' ?></td>
                                <td>
                                    <button class="btn btn-sm btn-info text-white" data-bs-toggle="modal" data-bs-target="#editLessonModal<?= $lesson['id'] ?>">Edit</button>
                                    <a href="<?= BASE_URL ?>/admin/deleteLesson/<?= $lesson['id'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('Delete this lesson?');">Delete</a>
                                    
                                    <!-- Edit Lesson Modal -->
                                    <div class="modal fade" id="editLessonModal<?= $lesson['id'] ?>" tabindex="-1">
                                        <div class="modal-dialog">
                                            <form method="POST" action="<?= BASE_URL ?>/admin/updateLesson" enctype="multipart/form-data" class="modal-content bg-dark text-white">
                                                <div class="modal-header border-secondary">
                                                    <h5 class="modal-title">Edit Lesson</h5>
                                                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                                                </div>
                                                <div class="modal-body text-start">
                                                    <input type="hidden" name="lesson_id" value="<?= $lesson['id'] ?>">
                                                    
                                                    <div class="mb-3">
                                                        <label class="form-label">Lesson Title</label>
                                                        <input type="text" name="title" class="form-control" value="<?= htmlspecialchars($lesson['title']) ?>" required>
                                                    </div>
                                                    <div class="mb-3">
                                                        <label class="form-label">Description</label>
                                                        <textarea name="description" class="form-control" rows="3"><?= htmlspecialchars($lesson['description'] ?? '') ?></textarea>
                                                    </div>
                                                    <div class="mb-3">
                                                        <label class="form-label">Video ID / Path</label>
                                                        <input type="text" name="bunny_video_id" class="form-control" value="<?= htmlspecialchars($lesson['bunny_video_id']) ?>" required>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-6 mb-3">
                                                            <label class="form-label">Duration</label>
                                                            <input type="text" name="duration" class="form-control" value="<?= htmlspecialchars($lesson['duration'] ?? '') ?>">
                                                        </div>
                                                        <div class="col-md-6 mb-3">
                                                            <label class="form-label">Sort Order</label>
                                                            <input type="number" name="sort_order" class="form-control" value="<?= htmlspecialchars($lesson['sort_order']) ?>">
                                                        </div>
                                                    </div>
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="editPreview<?= $lesson['id'] ?>" name="is_preview" value="1" <?= $lesson['is_preview'] ? 'checked' : '' ?>>
                                                        <label class="form-check-label" for="editPreview<?= $lesson['id'] ?>">Free Preview (Unlocked)</label>
                                                    </div>
                                                </div>
                                                <div class="modal-footer border-secondary">
                                                    <button type="submit" class="btn btn-primary">Save Changes</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        <?php elseif(isset($data['selected_module'])): ?>
                            <tr><td colspan="6" class="text-center p-4">No lessons in this module yet. Click 'Add New Lesson' to create one.</td></tr>
                        <?php else: ?>
                            <tr><td colspan="6" class="text-center p-4">Please select a module from the left menu.</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- Create Lesson Modal -->
<?php if(isset($data['selected_module'])): ?>
<div class="modal fade" id="createLessonModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <form id="lessonUploadForm" method="POST" action="<?= BASE_URL ?>/admin/createLesson" enctype="multipart/form-data" class="modal-content bg-dark text-white" style="border: 1px solid #444;">
            <div class="modal-header">
                <h5 class="modal-title">Add Lesson to <?= htmlspecialchars($data['selected_module']['title']) ?></h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <input type="hidden" name="module_id" value="<?= $data['selected_module']['id'] ?>">
                
                <div class="row">
                    <div class="col-md-8 mb-3">
                        <label class="form-label">Lesson Title</label>
                        <input type="text" name="title" class="form-control" required placeholder="e.g. Welcome & Mindset Setup">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">Duration</label>
                        <input type="text" name="duration" class="form-control" placeholder="e.g. 15:30">
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">Description / Resources (Optional)</label>
                    <textarea name="description" class="form-control" rows="3" placeholder="Add text below the video like links to templates..."></textarea>
                </div>
                
                <div class="mb-3 border border-secondary p-3 rounded">
                    <label class="form-label text-success fw-bold">Resource File / Attachment (Optional)</label>
                    <p class="small text-muted mb-2">Upload a ZIP, PDF, or Doc file for students to download.</p>
                    <input type="file" name="attachment_file" class="form-control bg-dark text-white border-secondary">
                </div>

                <div class="mb-3 border border-secondary p-3 rounded">
                    <label class="form-label fw-bold text-info">Video Setup (Choose ONE option) <span class="text-danger">*</span></label>
                    
                    <div class="mt-2">
                        <p class="small fw-bold mb-1">Option 1: Direct File Upload (Recommended)</p>
                        <p class="small text-muted mb-2">Upload your MP4 video file here. The video will be saved directly to your hostinger storage.</p>
                        <input type="file" name="video_file" class="form-control border-primary mb-3" accept="video/mp4,video/x-m4v,video/*">
                    </div>

                    <hr>

                    <div>
                        <p class="small fw-bold mb-1">Option 2: Paste External Video ID</p>
                        <p class="small text-muted mb-2">Only use this if you are using an external video hosting platform.</p>
                        <input type="text" name="vdo_video_id" class="form-control border-secondary" placeholder="e.g. 123e4567e89b12d3a456426614174000">
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Sort Order (0, 1, 2...)</label>
                        <input type="number" name="sort_order" class="form-control" value="0">
                    </div>
                    <div class="col-md-6 mb-3 d-flex align-items-end pb-2">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="isPreview" name="is_preview" value="1">
                            <label class="form-check-label" for="isPreview">Free Preview (Unlocked for everyone)</label>
                        </div>
                    </div>
                </div>
                
                <!-- Loading Indicator -->
                <div id="uploadStatus" class="alert alert-info d-none mt-3" style="color: black !important;">
                    <div class="mb-2" style="color: black !important;"><strong>Uploading video...</strong> <span id="uploadPercent" class="badge bg-success ms-2 text-white">0%</span></div>
                    <div class="progress mb-2" style="height: 25px; background-color: #e9ecef;">
                        <div id="uploadProgressBar" class="progress-bar progress-bar-striped progress-bar-animated bg-success fw-bold text-white" role="progressbar" style="width: 0%; font-size: 14px;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
                    </div>
                    <small style="color: black !important;" class="d-block mt-2"><i class="fw-bold">Note:</i> Video upload time depends entirely on your internet connection's upload speed. Large video files may take several minutes to upload. Please do not close this window.</small>
                </div>
            </div>
            <div class="modal-footer">
                <button type="submit" id="saveBtn" class="btn btn-primary px-4">Upload & Save Lesson</button>
            </div>
        </form>
    </div>
</div>
<?php endif; ?>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<script>
document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('lessonUploadForm');
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop standard form submission
            
            var fileInput = form.querySelector('input[name="video_file"]');
            var uploadStatus = document.getElementById('uploadStatus');
            var progressBar = document.getElementById('uploadProgressBar');
            var percentText = document.getElementById('uploadPercent');
            var saveBtn = document.getElementById('saveBtn');
            
            // If external video ID is pasted or no file selected, just submit normally
            if(!fileInput.files.length) {
                var formData = new FormData(form);
                submitFinalForm(formData);
                return;
            }

            var file = fileInput.files[0];
            var chunkSize = 2 * 1024 * 1024; // 2MB
            var totalChunks = Math.ceil(file.size / chunkSize);
            var chunkIndex = 0;
            var uniqueFileName = Date.now() + '_' + file.name;

            uploadStatus.classList.remove('d-none');
            saveBtn.disabled = true;
            saveBtn.innerText = "Uploading... Please wait";

            function uploadNextChunk() {
                var start = chunkIndex * chunkSize;
                var end = Math.min(start + chunkSize, file.size);
                var chunk = file.slice(start, end);

                var formData = new FormData();
                formData.append('file', chunk);
                formData.append('fileName', uniqueFileName);
                formData.append('chunkIndex', chunkIndex);
                formData.append('totalChunks', totalChunks);

                var xhr = new XMLHttpRequest();
                xhr.open('POST', '<?= BASE_URL ?>/admin/uploadChunk', true);
                
                xhr.onload = function() {
                    if (xhr.status >= 200 && xhr.status < 400) {
                        try {
                            var response = JSON.parse(xhr.responseText);
                            if(response.success) {
                                chunkIndex++;
                                var percentComplete = Math.round((chunkIndex / totalChunks) * 100);
                                progressBar.style.width = percentComplete + '%';
                                progressBar.setAttribute('aria-valuenow', percentComplete);
                                progressBar.innerText = percentComplete + '%';
                                percentText.innerText = percentComplete + '%';

                                if(chunkIndex < totalChunks) {
                                    uploadNextChunk();
                                } else {
                                    saveBtn.innerText = "Processing on server... Almost done!";
                                    
                                    // Finalize form submission with the path
                                    var finalFormData = new FormData(form);
                                    finalFormData.delete('video_file'); // Don't send the file again
                                    finalFormData.append('uploaded_video_path', response.path);
                                    submitFinalForm(finalFormData);
                                }
                            } else {
                                handleError(response.error || 'Server error');
                            }
                        } catch(e) {
                            // If response is not JSON (e.g. fatal PHP error)
                            handleError('Server returned invalid response');
                        }
                    } else {
                        handleError('Status Code: ' + xhr.status);
                    }
                };

                xhr.onerror = function() {
                    handleError('Network error');
                };

                xhr.send(formData);
            }

            function handleError(msg) {
                alert('An error occurred during upload. ' + msg);
                saveBtn.disabled = false;
                saveBtn.innerText = "Upload & Save Lesson";
                uploadStatus.classList.add('d-none');
                progressBar.style.width = '0%';
                percentText.innerText = '0%';
            }

            function submitFinalForm(formData) {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', form.action, true);
                xhr.onload = function() {
                    if (xhr.status >= 200 && xhr.status < 400) {
                        window.location.reload();
                    } else {
                        handleError('Failed to create lesson. Status: ' + xhr.status);
                    }
                };
                xhr.onerror = function() {
                    handleError('Network error while finalizing.');
                };
                xhr.send(formData);
            }

            uploadNextChunk();
        });
    }
});
</script>
