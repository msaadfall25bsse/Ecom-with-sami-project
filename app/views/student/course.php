<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= isset($data['title']) ? htmlspecialchars($data['title']) : 'Student Dashboard' ?></title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Plyr CSS -->
    <link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css" />
    <style>
        body { background-color: #f8f9fa; font-family: 'Inter', sans-serif; }
        .course-sidebar { height: calc(100vh - 60px); overflow-y: auto; background-color: #fff; border-right: 1px solid #e9ecef; }
        .video-container { position: relative; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); overflow: hidden; background: #000; }
        .nav-header { background-color: #0a0a0a; color: white; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; }
        .module-title { font-size: 0.9rem; font-weight: bold; color: #6c757d; text-transform: uppercase; letter-spacing: 1px; padding: 15px 20px 5px; }
        .lesson-link { display: block; padding: 12px 20px; color: #212529; text-decoration: none; border-left: 3px solid transparent; transition: all 0.2s; }
        .lesson-link:hover { background-color: #f1f5f9; }
        .lesson-link.active { background-color: #e6f4fc; border-left-color: #00a2e8; font-weight: bold; color: #00a2e8; }
        .lesson-duration { font-size: 0.75rem; color: #adb5bd; float: right; }
        
        /* Custom Plyr Theme Color */
        :root {
            --plyr-color-main: #00a2e8;
        }
    </style>
</head>
<body>

    <!-- Top Navigation -->
    <div class="nav-header">
        <h5 class="mb-0 fw-bold">Ecommstory Dashboard</h5>
        <a href="<?= BASE_URL ?>" class="btn btn-sm btn-outline-light">Back to Website</a>
    </div>

    <div class="container-fluid p-0">
        <div class="row g-0">
            
            <!-- Left Sidebar (Curriculum) -->
            <div class="col-lg-3 col-md-4 course-sidebar d-none d-md-block">
                <?php if(isset($data['curriculum']) && count($data['curriculum']) > 0): ?>
                    <?php foreach($data['curriculum'] as $modData): ?>
                        <div class="module-title"><?= htmlspecialchars($modData['module']['title']) ?></div>
                        
                        <?php if(count($modData['lessons']) > 0): ?>
                            <?php foreach($modData['lessons'] as $lesson): ?>
                                <?php $isCompleted = in_array($lesson['id'], $data['completed_lessons']); ?>
                                <a href="<?= BASE_URL ?>/course/index/<?= $lesson['id'] ?>" class="lesson-link <?= (isset($data['current_lesson']) && $data['current_lesson']['id'] == $lesson['id']) ? 'active' : '' ?>">
                                    <?php if($isCompleted): ?><i class="bi bi-check-circle-fill text-success fs-6 me-2"></i><?php else: ?><i class="bi bi-play-circle fs-6 me-2"></i><?php endif; ?> <?= htmlspecialchars($lesson['title']) ?>
                                    <?php if($lesson['duration']): ?>
                                        <span class="lesson-duration"><?= htmlspecialchars($lesson['duration']) ?></span>
                                    <?php endif; ?>
                                </a>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <div class="px-3 py-2 small text-muted">No lessons added yet.</div>
                        <?php endif; ?>
                        
                    <?php endforeach; ?>
                <?php else: ?>
                    <div class="p-4 text-center text-muted">Curriculum is being updated.</div>
                <?php endif; ?>
            </div>

            <!-- Right Content (Video Player) -->
            <div class="col-md-8 col-lg-9 p-4">
                <?php if(!empty($data['announcement_text'])): ?>
                <div class="alert alert-warning mb-4 shadow-sm border-0 d-flex align-items-center">
                    <i class="bi bi-megaphone-fill me-3 fs-4 text-warning"></i>
                    <marquee behavior="scroll" direction="left" scrollamount="6" class="m-0 fw-bold text-dark">
                        <?= htmlspecialchars($data['announcement_text']) ?>
                    </marquee>
                </div>
                <?php endif; ?>

                <?php if(isset($data['current_lesson'])): ?>
                    <h2 class="fw-bold mb-4"><?= htmlspecialchars($data['current_lesson']['title']) ?></h2>
                    
                    <!-- VdoCipher Strict Embed System -->
                    <?php if(!empty($data['is_vdocipher']) && !empty($data['vdo_otp']) && !empty($data['vdo_playbackInfo'])): ?>
                        <div class="vdo-embed-container mb-4" style="position:relative;padding-top:56.25%;">
                            <iframe
                              src="https://player.vdocipher.com/v2/?otp=<?= $data['vdo_otp'] ?>&playbackInfo=<?= $data['vdo_playbackInfo'] ?>"
                              style="border:0;position:absolute;top:0;left:0;height:100%;width:100%;"
                              allow="encrypted-media"
                              allowfullscreen
                            ></iframe>
                        </div>
                    <!-- Local File Player -->
                    <?php elseif(!empty($data['is_local'])): ?>
                        <div class="video-container mb-4">
                            <video 
                                id="player"
                                src="<?= BASE_URL ?>/<?= htmlspecialchars($data['current_lesson']['bunny_video_id']) ?>" 
                                controls 
                                controlsList="nodownload" 
                                oncontextmenu="return false;">
                                Your browser does not support HTML video.
                            </video>
                        </div>
                    <!-- Old Bunny Stream Player -->
                    <?php elseif(!empty($data['is_bunny'])): ?>
                        <div class="video-container mb-4" style="position:relative;padding-top:56.25%;">
                            <iframe src="https://iframe.mediadelivery.net/embed/<?= BUNNY_LIBRARY_ID ?>/<?= htmlspecialchars($data['current_lesson']['bunny_video_id']) ?>?autoplay=false&loop=false&muted=false&preload=true&responsive=true" 
                                loading="lazy" 
                                style="border:0;position:absolute;top:0;left:0;height:100%;width:100%;" 
                                allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;" 
                                allowfullscreen="true">
                            </iframe>
                        </div>
                    <?php else: ?>
                        <div class="bg-dark text-white d-flex align-items-center justify-content-center rounded mb-4" style="height: 400px;">
                            <div class="text-center">
                                <p class="mt-2">Video not available or invalid Video ID.</p>
                            </div>
                        </div>
                    <?php endif; ?>

                    <!-- Lesson Description -->
                    <div class="card shadow-sm border-0 rounded-4">
                        <div class="card-body p-4">
                            <h5 class="fw-bold mb-3">Lesson Resources</h5>
                            <?php if(!empty($data['current_lesson']['description'])): ?>
                                <div class="text-secondary" style="white-space: pre-line;">
                                    <?= htmlspecialchars($data['current_lesson']['description']) ?>
                                </div>
                            <?php else: ?>
                                <p class="text-muted mb-0">No additional resources for this lesson.</p>
                            <?php endif; ?>
                            
                            <?php 
                            $isThisCompleted = in_array($data['current_lesson']['id'], $data['completed_lessons']); 
                            if ($isThisCompleted): 
                            ?>
                                <button class="btn btn-success mt-4" disabled><i class="bi bi-check-all"></i> Completed</button>
                            <?php else: ?>
                                <form action="<?= BASE_URL ?>/course/markComplete/<?= $data['current_lesson']['id'] ?>" method="POST" class="d-inline">
                                    <button type="submit" class="btn btn-outline-primary mt-4"><i class="bi bi-check2-circle"></i> Mark as Complete</button>
                                </form>
                            <?php endif; ?>
                        </div>
                    </div>
                    
                <?php else: ?>
                    <div class="text-center p-5">
                        <h3 class="text-muted">Welcome to the Course!</h3>
                        <p class="text-secondary">Please select a lesson from the menu to begin learning.</p>
                    </div>
                <?php endif; ?>

                <!-- Global Downloads & Links (Phase 3) -->
                <div class="row mt-5">
                    <?php if(!empty($data['downloads'])): ?>
                    <div class="col-md-6 mb-4">
                        <div class="card shadow-sm border-0 h-100 rounded-4">
                            <div class="card-body p-4">
                                <h5 class="fw-bold mb-3"><i class="bi bi-cloud-download text-primary"></i> Download Center</h5>
                                <?php foreach($data['downloads'] as $dl): ?>
                                    <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                                        <div>
                                            <h6 class="mb-1 fw-bold"><?= htmlspecialchars($dl['title']) ?></h6>
                                            <small class="text-muted"><?= htmlspecialchars($dl['description']) ?></small>
                                        </div>
                                        <a href="<?= BASE_URL ?>/<?= $dl['file_path'] ?>" class="btn btn-sm btn-primary rounded-pill px-3" target="_blank">Download</a>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>
                    <?php endif; ?>

                    <?php if(!empty($data['links'])): ?>
                    <div class="col-md-6 mb-4">
                        <div class="card shadow-sm border-0 h-100 rounded-4">
                            <div class="card-body p-4">
                                <h5 class="fw-bold mb-3"><i class="bi bi-link-45deg text-primary"></i> Important Links</h5>
                                <?php foreach($data['links'] as $link): ?>
                                    <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                                        <div>
                                            <h6 class="mb-1 fw-bold"><?= htmlspecialchars($link['title']) ?></h6>
                                            <small class="text-muted"><?= htmlspecialchars($link['description']) ?></small>
                                        </div>
                                        <a href="<?= htmlspecialchars($link['url']) ?>" class="btn btn-sm btn-outline-primary rounded-pill px-3" target="_blank">Open Link</a>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>
                    <?php endif; ?>
                </div>

            </div>

        </div>
    </div>

    <!-- Mobile Menu Button (Fixed Bottom) -->
    <div class="d-md-none fixed-bottom bg-white border-top p-2 text-center shadow-lg">
        <button class="btn btn-primary w-100 fw-bold" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileCurriculum">
            View Curriculum Menu
        </button>
    </div>

    <!-- Mobile Offcanvas Menu -->
    <div class="offcanvas offcanvas-start" tabindex="-1" id="mobileCurriculum">
        <div class="offcanvas-header bg-dark text-white">
            <h5 class="offcanvas-title fw-bold">Curriculum</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body p-0">
             <?php if(isset($data['curriculum'])): ?>
                <?php foreach($data['curriculum'] as $modData): ?>
                    <div class="module-title"><?= htmlspecialchars($modData['module']['title']) ?></div>
                    <?php foreach($modData['lessons'] as $lesson): ?>
                        <?php $isCompleted = in_array($lesson['id'], $data['completed_lessons']); ?>
                        <a href="<?= BASE_URL ?>/course/index/<?= $lesson['id'] ?>" class="lesson-link <?= (isset($data['current_lesson']) && $data['current_lesson']['id'] == $lesson['id']) ? 'active' : '' ?>">
                            <?php if($isCompleted): ?><i class="bi bi-check-circle-fill text-success me-1"></i><?php else: ?><i class="bi bi-play-circle me-1"></i><?php endif; ?> <?= htmlspecialchars($lesson['title']) ?>
                        </a>
                    <?php endforeach; ?>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Plyr JS -->
    <script src="https://cdn.plyr.io/3.7.8/plyr.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const player = new Plyr('#player', {
                controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
                keyboard: { focused: true, global: true },
                disableContextMenu: true,
            });
        });
    </script>
</body>
</html>
