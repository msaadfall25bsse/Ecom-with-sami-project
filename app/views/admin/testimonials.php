<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h3 text-white">Manage Social Proof</h1>
</div>

<div class="card bg-dark text-white p-4">
    <ul class="nav nav-tabs border-secondary mb-4" id="proofTabs">
        <li class="nav-item">
            <a class="nav-link active" data-bs-toggle="tab" href="#textReviews">Text Reviews</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-bs-toggle="tab" href="#videoReviews">Video Testimonials</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-bs-toggle="tab" href="#earningProofs">Earning Proofs</a>
        </li>
    </ul>

    <div class="tab-content">
        <!-- TEXT REVIEWS TAB -->
        <div class="tab-pane fade show active" id="textReviews">
            <div class="row">
                <div class="col-md-4">
                    <h5 class="mb-3">Add New Review</h5>
                    <form action="<?= BASE_URL ?>/admin/addReview" method="POST" enctype="multipart/form-data">
                        <div class="mb-3">
                            <label>Student Name</label>
                            <input type="text" name="student_name" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label>Rating (1-5)</label>
                            <input type="number" name="rating" class="form-control" min="1" max="5" value="5" required>
                        </div>
                        <div class="mb-3">
                            <label>Review Text</label>
                            <textarea name="review_text" class="form-control" rows="3" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label>Profile Image (Optional)</label>
                            <input type="file" name="profile_image" class="form-control bg-dark text-white" accept="image/*">
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Add Review</button>
                    </form>
                </div>
                <div class="col-md-8">
                    <h5 class="mb-3">Existing Reviews</h5>
                    <div class="table-responsive">
                        <table class="table table-dark table-hover">
                            <thead><tr><th>Name</th><th>Rating</th><th>Review</th><th>Action</th></tr></thead>
                            <tbody>
                                <?php foreach($reviews as $review): ?>
                                <tr>
                                    <td><?= htmlspecialchars($review['student_name']) ?></td>
                                    <td><?= $review['rating'] ?> Stars</td>
                                    <td><small><?= htmlspecialchars(substr($review['review_text'], 0, 50)) ?>...</small></td>
                                    <td>
                                        <a href="<?= BASE_URL ?>/admin/deleteReview/<?= $review['id'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('Delete this review?');">Delete</a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- VIDEO TESTIMONIALS TAB -->
        <div class="tab-pane fade" id="videoReviews">
            <div class="row">
                <div class="col-md-4">
                    <h5 class="mb-3">Add YouTube Video</h5>
                    <form action="<?= BASE_URL ?>/admin/addVideoTestimonial" method="POST">
                        <div class="mb-3">
                            <label>YouTube Embed Link or ID</label>
                            <input type="text" name="video_url" class="form-control" placeholder="https://www.youtube.com/embed/XXXXX" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Add Video</button>
                    </form>
                </div>
                <div class="col-md-8">
                    <h5 class="mb-3">Existing Videos</h5>
                    <div class="row g-2">
                        <?php foreach($videos as $video): ?>
                        <div class="col-4">
                            <div class="card bg-secondary text-white">
                                <div class="card-body p-2 text-center">
                                    <small class="d-block mb-2 text-truncate"><?= htmlspecialchars($video['video_url']) ?></small>
                                    <a href="<?= BASE_URL ?>/admin/deleteVideoTestimonial/<?= $video['id'] ?>" class="btn btn-sm btn-danger w-100" onclick="return confirm('Delete?');">Delete</a>
                                </div>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        </div>

        <!-- EARNING PROOFS TAB -->
        <div class="tab-pane fade" id="earningProofs">
            <div class="row">
                <div class="col-md-4">
                    <h5 class="mb-3">Upload Screenshot</h5>
                    <form action="<?= BASE_URL ?>/admin/addEarningProof" method="POST" enctype="multipart/form-data">
                        <div class="mb-3">
                            <label>Screenshot Image</label>
                            <input type="file" name="proof_image" class="form-control bg-dark text-white" accept="image/*" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Upload Image</button>
                    </form>
                </div>
                <div class="col-md-8">
                    <h5 class="mb-3">Existing Proofs</h5>
                    <div class="row g-2">
                        <?php foreach($proofs as $proof): ?>
                        <div class="col-3">
                            <div class="card bg-secondary text-white position-relative">
                                <img src="<?= BASE_URL ?>/<?= htmlspecialchars($proof['image_path']) ?>" class="card-img-top" alt="Proof" style="height: 100px; object-fit: cover;">
                                <a href="<?= BASE_URL ?>/admin/deleteEarningProof/<?= $proof['id'] ?>" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1" onclick="return confirm('Delete?');">X</a>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
