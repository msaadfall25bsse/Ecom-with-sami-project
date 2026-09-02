<?php
function formatHeading($text) {
    $text = htmlspecialchars($text);
    $text = nl2br($text);
    // Replace *text* with gradient span
    $style = "background: linear-gradient(90deg, var(--primary-color), var(--secondary-color)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;";
    return preg_replace('/\*(.*?)\*/', '<span style="' . $style . '">$1</span>', $text);
}

function formatDangerHeading($text) {
    $text = htmlspecialchars($text);
    $text = nl2br($text);
    // Replace *text* with danger class span
    return preg_replace('/\*(.*?)\*/', '<span class="text-danger">$1</span>', $text);
}
?>
<!-- Hero Section -->
<section class="pt-5 pb-4" style="position: relative; overflow: hidden; font-family: 'Inter', sans-serif;">
    <div class="container my-3 text-center">
        <div class="row justify-content-center">
            
            <!-- Top Text Content -->
            <div class="col-lg-10 col-xl-8 mb-4" data-aos="fade-up">
                <div class="d-inline-flex align-items-center rounded-pill px-3 py-1 mb-3" style="background: rgba(0, 255, 136, 0.05); border: 1px solid rgba(0, 255, 136, 0.2); color: var(--primary-color);">
                    <div class="rounded-circle me-2" style="width: 10px; height: 10px; background-color: var(--primary-color);"></div>
                    <span class="fw-semibold" style="font-size: 0.8rem; letter-spacing: 0.5px;">MASTER UAE & KSA DROPSHIPPING</span>
                </div>
                
                <h1 class="fw-black mb-3" style="color: var(--text-color); line-height: 1.2; font-weight: 900; font-style: italic; font-size: clamp(2.2rem, 4vw, 3.5rem); letter-spacing: -1px;">
                    <?= formatHeading($settings['home_hero_title'] ?? "Pakistan's #1\n*UAE & KSA DROPSHIPPING*\nTRAINING") ?>
                </h1>
                
                <p class="text-light mt-3 mb-2" style="font-size: 1.25rem;">
                    <?= htmlspecialchars($settings['home_hero_subtitle'] ?? 'Learn how to start online dropshipping store in UAE & KSA') ?>
                </p>
                <p class="text-muted mb-4" style="font-size: 1.1rem; font-weight: 500;">
                    <?= htmlspecialchars($settings['home_hero_desc'] ?? 'Step-By-Step Beginner Friendly Training') ?>
                </p>

                <a href="<?= BASE_URL ?>/home/checkout" class="btn btn-premium px-4 py-2 mb-2 text-uppercase fw-bold shadow" style="font-size: 1rem;">YES! I WANT TO LEARN THIS</a>
                
                <div class="d-flex align-items-center justify-content-center mt-3 mb-2">
                    <div class="d-flex" style="margin-right: 15px;">
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" class="rounded-circle shadow-sm" width="35" height="35" style="border: 2px solid var(--bg-color); z-index: 5;">
                        <img src="https://randomuser.me/api/portraits/men/46.jpg" class="rounded-circle shadow-sm" width="35" height="35" style="border: 2px solid var(--bg-color); z-index: 4; margin-left: -12px;">
                        <img src="https://randomuser.me/api/portraits/women/44.jpg" class="rounded-circle shadow-sm" width="35" height="35" style="border: 2px solid var(--bg-color); z-index: 3; margin-left: -12px;">
                        <img src="https://randomuser.me/api/portraits/men/22.jpg" class="rounded-circle shadow-sm" width="35" height="35" style="border: 2px solid var(--bg-color); z-index: 2; margin-left: -12px;">
                        <img src="https://randomuser.me/api/portraits/women/32.jpg" class="rounded-circle shadow-sm" width="35" height="35" style="border: 2px solid var(--bg-color); z-index: 1; margin-left: -12px;">
                    </div>
                    <div class="text-start">
                        <div class="text-warning" style="font-size: 0.8rem; letter-spacing: 2px;">★★★★★</div>
                        <div class="text-muted small fw-bold" style="font-size: 0.85rem;">Trusted by 9,700+ Students</div>
                    </div>
                </div>
            </div>
            
            <!-- Bottom Video Content -->
            <div class="col-lg-10 col-xl-8 position-relative mt-2" data-aos="zoom-in" data-aos-delay="100">
                <div class="d-none d-lg-flex justify-content-end align-items-center position-absolute w-100" style="top: -50px; right: 0;">
                    <svg width="60" height="60" viewBox="0 0 100 100" style="transform: rotate(20deg); margin-right: 15px;">
                        <path d="M90,30 Q40,20 30,70" fill="none" stroke="var(--primary-color)" stroke-width="4" stroke-linecap="round"/>
                        <path d="M20,60 L30,75 L45,65" fill="none" stroke="var(--primary-color)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <div class="rounded-pill px-4 py-2" style="background: rgba(0, 255, 136, 0.05); border: 1px solid rgba(0, 255, 136, 0.2); color: var(--primary-color); font-weight: 500; font-size: 0.95rem;">
                        Ecom With Sami Program
                    </div>
                </div>

                <div class="shadow rounded-4 overflow-hidden position-relative mx-auto" style="border: 2px solid var(--border-color); background-color: var(--card-bg); max-width: 800px;">
                    <div class="py-2 text-center fw-bold" style="background-color: var(--card-bg); color: var(--text-color); border-bottom: 1px solid var(--border-color); font-size: 0.8rem; letter-spacing: 0.5px;">
                        WATCH THIS 128 SECONDS OF VIDEO TO LEARN HOW EASY IT IS
                    </div>
                    <div class="ratio ratio-16x9 position-relative">
                        <button id="unmuteBtn" class="position-absolute shadow d-flex align-items-center justify-content-center border-0 px-3 py-2 rounded-pill fw-bold" style="top: 15px; left: 15px; width: auto; height: auto; z-index: 15; background-color: var(--primary-color); color: #000; font-size: 0.85rem; transition: opacity 0.3s;" onclick="unmuteVideo()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-volume-mute-fill me-2" viewBox="0 0 16 16">
                              <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/>
                            </svg>
                            Click to Unmute
                        </button>
                        <?php if(isset($settings['hero_video_type']) && $settings['hero_video_type'] == 'local' && !empty($settings['hero_video_url'])): ?>
                            <video id="local-video" autoplay muted loop playsinline controls class="w-100" style="object-fit: cover;">
                                <source src="<?= BASE_URL ?>/<?= htmlspecialchars($settings['hero_video_url']) ?>" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        <?php else: ?>
                            <?php 
                            $yt_url = $settings['hero_video_url'] ?? 'https://www.youtube.com/embed/9coOU5ea3nk?rel=0';
                            $yt_url .= (strpos($yt_url, '?') !== false ? '&' : '?') . 'autoplay=1&mute=1&enablejsapi=1';
                            ?>
                            <iframe id="yt-video" src="<?= htmlspecialchars($yt_url) ?>" title="E-Commerce Course Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        <?php endif; ?>
                    </div>
                    
                    <script>
                    function unmuteVideo() {
                        var yt = document.getElementById('yt-video');
                        var loc = document.getElementById('local-video');
                        if (yt) {
                            yt.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
                            yt.contentWindow.postMessage('{"event":"command","func":"setVolume","args":[100]}', '*');
                        }
                        if (loc) {
                            loc.muted = false;
                            loc.volume = 1;
                        }
                        var btn = document.getElementById('unmuteBtn');
                        btn.style.opacity = '0';
                        setTimeout(() => { btn.style.display = 'none'; }, 300);
                    }
                    </script>
                </div>
            </div>
            
        </div>
    </div>
</section>

<!-- Sticky Bottom Bar -->
<div class="fixed-bottom w-100" style="z-index: 1000; box-shadow: 0 -4px 25px rgba(0, 255, 136, 0.1); border-top-left-radius: 20px; border-top-right-radius: 20px; padding-bottom: 10px; background: rgba(3, 7, 8, 0.95); backdrop-filter: blur(15px); border-top: 1px solid var(--border-color);">
    <div class="container px-3 pt-3 pb-2">
        <!-- Mobile layout: stacked -->
        <div class="d-flex d-lg-none align-items-center justify-content-between gap-3">
            <div class="d-flex align-items-center gap-2">
                <span class="text-decoration-line-through text-muted fw-bold" style="font-size: 0.95rem; opacity: 0.7;"><?= number_format($settings['course_original_price'] ?? 32500) ?></span>
                <span class="fw-black text-white" style="font-size: 1.2rem;">PKR <?= number_format($settings['course_price'] ?? 3900) ?>/-</span>
            </div>
            <a href="<?= BASE_URL ?>/home/checkout" class="btn btn-premium py-2 px-4 text-uppercase fw-bold shadow-sm flex-shrink-0" style="font-size: 0.9rem; border-radius: 12px !important;">GET ACCESS NOW</a>
        </div>
        <!-- Desktop layout: side by side with more info -->
        <div class="d-none d-lg-flex align-items-center justify-content-between gap-4">
            <div class="d-flex align-items-center gap-3">
                <div>
                    <span class="text-muted fw-bold text-decoration-line-through me-2" style="font-size: 1rem;">PKR <?= number_format($settings['course_original_price'] ?? 32500) ?></span>
                    <span class="fw-black text-white" style="font-size: 1.5rem;">PKR <?= number_format($settings['course_price'] ?? 3900) ?>/- Only</span>
                </div>
                <span class="badge px-3 py-2 fw-semibold" style="background: rgba(0,255,136,0.15); color: var(--primary-color); border: 1px solid rgba(0,255,136,0.3); font-size: 0.8rem;">🔒 14-Day Money-Back Guarantee</span>
                <span class="badge px-3 py-2 fw-semibold" style="background: rgba(0,255,136,0.1); color: var(--primary-color); border: 1px solid rgba(0,255,136,0.2); font-size: 0.8rem;">⚡ Instant Access</span>
            </div>
            <a href="<?= BASE_URL ?>/home/checkout" class="btn btn-premium px-5 py-2 text-uppercase fw-bold shadow" style="font-size: 1rem; border-radius: 12px !important; white-space: nowrap;">GET ACCESS NOW</a>
        </div>
    </div>
</div>

<!-- SECTION 2: Why Dropshipping Is the Smartest Online Business -->
<section class="py-5 font-inter border-top border-bottom">
    <div class="container py-4 text-center">
        <h2 class="fw-black mb-5" style="font-size: clamp(1.8rem, 2.5vw, 2.4rem); font-style: italic; line-height: 1.2;" data-aos="fade-up">
            <?= formatHeading($settings['home_why_dropshipping_title'] ?? "WHY DROPSHIPPING IS THE\n*SMARTEST ONLINE BUSINESS* RIGHT NOW") ?>
        </h2>
        <div class="row g-4 text-start justify-content-center">
            <div class="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="100">
                <div class="p-4 rounded-4 h-100 border shadow-sm" style="background-color: var(--card-bg); border-color: var(--border-color) !important;">
                    <div class="fs-1 mb-3">🌍</div>
                    <h5 class="fw-bold mb-2">Work From Anywhere</h5>
                    <p class="text-secondary small mb-0">Run your store from your bedroom, a cafe, or even another country.</p>
                </div>
            </div>
            <div class="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="200">
                <div class="p-4 rounded-4 h-100 border shadow-sm" style="background-color: var(--card-bg); border-color: var(--border-color) !important;">
                    <div class="fs-1 mb-3">📝</div>
                    <h5 class="fw-bold mb-2">No Company Registration</h5>
                    <p class="text-secondary small mb-0">No paperwork, licenses, or legal setup needed — just a laptop and internet.</p>
                </div>
            </div>
            <div class="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="300">
                <div class="p-4 rounded-4 h-100 border shadow-sm" style="background-color: var(--card-bg); border-color: var(--border-color) !important;">
                    <div class="fs-1 mb-3">📦</div>
                    <h5 class="fw-bold mb-2">Zero Inventory, Zero Risk</h5>
                    <p class="text-secondary small mb-0">You never buy stock upfront. Your supplier ships only after a customer orders.</p>
                </div>
            </div>
            <div class="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="400">
                <div class="p-4 rounded-4 h-100 border shadow-sm" style="background-color: var(--card-bg); border-color: var(--border-color) !important;">
                    <div class="fs-1 mb-3">🏦</div>
                    <h5 class="fw-bold mb-2">Get Paid Locally</h5>
                    <p class="text-secondary small mb-0">Receive your profits directly in your local bank account without any hassle.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 3: Here’s What You’ll Get Access To -->
<section class="py-5 font-inter border-bottom">
    <div class="container py-4">
        <div class="row align-items-center">
            <div class="col-lg-6 mb-4 mb-lg-0 text-center text-lg-start" data-aos="fade-right">
                <h2 class="fw-black mb-4" style="font-size: clamp(1.8rem, 2.5vw, 2.4rem); font-style: italic; line-height: 1.1;">
                    <?= formatHeading($settings['home_what_you_get_title'] ?? "HERE'S WHAT YOU'LL\n*GET ACCESS TO*") ?>
                </h2>
                <a href="<?= BASE_URL ?>/home/checkout" class="btn btn-premium px-5 py-3 mt-2 d-none d-lg-inline-block text-uppercase">GET ACCESS NOW</a>
            </div>
            <div class="col-lg-6" data-aos="fade-left">
                <div class="d-flex align-items-center mb-3 p-3 rounded-3 shadow-sm border ">
                    <div class="me-3 fs-1">🛒</div>
                    <div>
                        <h5 class="fw-bold mb-1">Start & Manage Your Own Store</h5>
                        <p class="text-secondary small mb-0">Learn to build high converting professional Shopify stores.</p>
                    </div>
                </div>
                <div class="d-flex align-items-center mb-3 p-3 rounded-3 shadow-sm border ">
                    <div class="me-3 fs-1">🚀</div>
                    <div>
                        <h5 class="fw-bold mb-1">Develop Practical Skills</h5>
                        <p class="text-secondary small mb-0">Master product research, FB & TikTok ads, and marketing strategy.</p>
                    </div>
                </div>
                <div class="d-flex align-items-center mb-3 p-3 rounded-3 shadow-sm border ">
                    <div class="me-3 fs-1">🤝</div>
                    <div>
                        <h5 class="fw-bold mb-1">Lifetime WhatsApp Support</h5>
                        <p class="text-secondary small mb-0">Never get stuck. Direct support to guide you whenever you need.</p>
                    </div>
                </div>
                <div class="d-flex align-items-center p-3 rounded-3 shadow-sm border ">
                    <div class="me-3 fs-1">👥</div>
                    <div>
                        <h5 class="fw-bold mb-1">Private Community Access</h5>
                        <p class="text-secondary small mb-0">Network with like-minded individuals and successful store owners.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 4: Instructor Profile -->
<section class="py-5 font-inter">
    <div class="container py-4">
        <div class="row align-items-center justify-content-center">
            <div class="col-md-4 text-center mb-4 mb-md-0" data-aos="zoom-in">
                <img src="<?= BASE_URL ?>/public/assets/img/sami.jpg" alt="Instructor Sami" class="rounded-circle shadow-lg" style="width: 250px; height: 250px; object-fit: cover; border: 6px solid #10b981;">
            </div>
            <div class="col-md-6 text-center text-md-start" data-aos="fade-left">
                <span class="badge mb-2 px-3 py-2 text-white" style="background-color: var(--primary-color); letter-spacing: 1px; color: #000 !important;">INSTRUCTOR</span>
                <h2 class="fw-black mb-1" style="font-style: italic; font-size: 2.2rem;">
                    <?= htmlspecialchars($settings['home_instructor_title'] ?? 'MEET SAMI') ?>
                </h2>
                <p class="fw-bold mb-3" style="color: var(--primary-color); font-size: 1.1rem;">
                    <?= htmlspecialchars($settings['home_instructor_subtitle'] ?? '7-Figure E-commerce Entrepreneur') ?>
                </p>
                <p class="text-secondary mb-4" style="line-height: 1.8;">
                    <?= htmlspecialchars($settings['home_instructor_desc'] ?? 'Sami has built multiple successful e-commerce brands from scratch and spent millions on advertising to crack the code. Now, he is sharing his exact blueprint to help you avoid mistakes and achieve financial freedom through dropshipping.') ?>
                </p>
                <div class="d-flex align-items-center justify-content-center justify-content-md-start">
                    <span class="text-warning fs-4 me-2">★★★★★</span>
                    <span class="fw-bold text-dark">4.9/5 Average Student Rating</span>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 5: Text Reviews Grid -->
<section class="py-5 font-inter text-center border-top">
    <div class="container py-4">
        <h2 class="fw-black mb-5" style="font-style: italic; font-size: clamp(1.8rem, 2.5vw, 2.2rem);" data-aos="fade-up">HEAR WHAT OUR STUDENTS ARE SAYING</h2>
        <div class="row g-4 justify-content-center text-start">
            <?php if(!empty($reviews)): ?>
                <?php foreach($reviews as $i => $review): ?>
                <div class="col-md-4 col-sm-6" data-aos="fade-up" data-aos-delay="<?= ($i+1) * 100 ?>">
                    <div class="p-4 rounded-4 shadow-sm border h-100" style="background-color: var(--card-bg); border-color: var(--border-color) !important;">
                        <div class="d-flex align-items-center mb-3">
                            <div class="bg-secondary rounded-circle me-3" style="width: 40px; height: 40px; background-image: url('<?= $review['image_path'] ? BASE_URL . '/' . htmlspecialchars($review['image_path']) : 'https://via.placeholder.com/40' ?>'); background-size: cover; background-position: center;"></div>
                            <div>
                                <h6 class="fw-bold mb-0 text-white"><?= htmlspecialchars($review['student_name']) ?></h6>
                                <span class="text-warning small"><?= str_repeat('★', $review['rating']) ?><?= str_repeat('☆', 5 - $review['rating']) ?></span>
                            </div>
                        </div>
                        <p class="text-secondary small mb-0">"<?= nl2br(htmlspecialchars($review['review_text'])) ?>"</p>
                    </div>
                </div>
                <?php endforeach; ?>
            <?php else: ?>
                <div class="col-12"><p class="text-muted">Reviews coming soon...</p></div>
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- SECTION 6: Still Unsure? You’re Fully Protected. -->
<section class="py-5 font-inter border-top text-center" style="background: radial-gradient(circle, rgba(0,255,136,0.05) 0%, transparent 60%);">
    <div class="container py-4">
        <div class="d-inline-block p-4 rounded-circle mb-4" style="background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.2);">
            <div style="font-size: 3rem;">🛡️</div>
        </div>
        <h2 class="fw-black mb-3" style="font-style: italic; font-size: clamp(1.8rem, 2.5vw, 2.2rem);" data-aos="fade-up">
            <?= htmlspecialchars($settings['home_guarantee_title'] ?? "STILL UNSURE? YOU'RE FULLY PROTECTED.") ?>
        </h2>
        <h4 class="fw-bold text-success mb-4" style="color: var(--primary-color) !important;" data-aos="fade-up" data-aos-delay="100">14-Day Money Back Guarantee</h4>
        <div class="row justify-content-center">
            <div class="col-lg-8 text-secondary" data-aos="fade-up" data-aos-delay="200">
                <p class="mb-0 fs-5">
                    <?= htmlspecialchars($settings['home_guarantee_text'] ?? "We are so confident in the value of this training that we are taking all the risk. Join the program, go through the modules, and if you don't feel like you received 10x the value, simply let us know within 14 days and we will refund every single penny. No questions asked.") ?>
                </p>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 7: Who Is This For? -->
<section class="py-5 font-inter border-top">
    <div class="container py-4 text-center">
        <h2 class="fw-black mb-5" style="font-style: italic; font-size: clamp(1.8rem, 2.5vw, 2.4rem);" data-aos="fade-up">
            <?= htmlspecialchars($settings['home_who_is_for_title'] ?? 'WHO IS THIS FOR?') ?>
        </h2>
        <div class="row g-4 text-start justify-content-center">
            <div class="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="100">
                <div class="p-4 rounded-4 h-100 border shadow-sm" style="background-color: var(--card-bg); border-color: var(--border-color) !important;">
                    <div class="fs-1 mb-3">👶</div>
                    <h5 class="fw-bold mb-2">Complete Beginners</h5>
                    <p class="text-secondary small mb-0">No prior experience? No problem. We start from the absolute basics.</p>
                </div>
            </div>
            <div class="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="200">
                <div class="p-4 rounded-4 h-100 border shadow-sm" style="background-color: var(--card-bg); border-color: var(--border-color) !important;">
                    <div class="fs-1 mb-3">📉</div>
                    <h5 class="fw-bold mb-2">Struggling with Ads</h5>
                    <p class="text-secondary small mb-0">If your ads are bleeding money, this will teach you how to finally become profitable.</p>
                </div>
            </div>
            <div class="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="300">
                <div class="p-4 rounded-4 h-100 border shadow-sm" style="background-color: var(--card-bg); border-color: var(--border-color) !important;">
                    <div class="fs-1 mb-3">💼</div>
                    <h5 class="fw-bold mb-2">Business Owners</h5>
                    <p class="text-secondary small mb-0">Ready to master store management and scale your existing operations to new heights.</p>
                </div>
            </div>
            <div class="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="400">
                <div class="p-4 rounded-4 h-100 border shadow-sm" style="background-color: var(--card-bg); border-color: var(--border-color) !important;">
                    <div class="fs-1 mb-3">💻</div>
                    <h5 class="fw-bold mb-2">Freelancers & Hustlers</h5>
                    <p class="text-secondary small mb-0">Add a highly profitable skill to your arsenal and build your own asset instead of working for clients.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 8: Complete Curriculum Breakdown -->
<section class="py-5 font-inter border-top">
    <div class="container py-4">
        <h2 class="fw-black text-center mb-5" style="font-style: italic; font-size: clamp(1.8rem, 2.5vw, 2.2rem);" data-aos="fade-up">EVERYTHING YOU GET INSIDE THE COURSE</h2>
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <!-- Module 1 -->
                <div class="p-4 p-md-5 rounded-4 shadow-sm mb-4 border-start border-5" style="border-color: var(--primary-color) !important; background-color: var(--card-bg);" data-aos="fade-up">
                    <h6 class="fw-bold mb-2" style="color: var(--primary-color); letter-spacing: 1px;">MODULE 1</h6>
                    <h3 class="fw-bold mb-3">E-Commerce Mindset & Foundation</h3>
                    <p class="text-secondary mb-0">Learn the exact mindset required to succeed in e-commerce. How to set up your business legally and prepare yourself mentally for the scale.</p>
                </div>
                <!-- Module 2 -->
                <div class="p-4 p-md-5 rounded-4 shadow-sm mb-4 border-start border-5" style="border-color: var(--primary-color) !important; background-color: var(--card-bg);" data-aos="fade-up">
                    <h6 class="fw-bold mb-2" style="color: var(--primary-color); letter-spacing: 1px;">MODULE 2</h6>
                    <h3 class="fw-bold mb-3">Step-by-Step Shopify Setup</h3>
                    <p class="text-secondary mb-0">Click-by-click Shopify tutorial. Learn how to design a premium store that builds trust instantly and converts visitors into buyers.</p>
                </div>
                <!-- Module 3 -->
                <div class="p-4 p-md-5 rounded-4 shadow-sm mb-4 border-start border-5" style="border-color: var(--primary-color) !important; background-color: var(--card-bg);" data-aos="fade-up">
                    <h6 class="fw-bold mb-2" style="color: var(--primary-color); letter-spacing: 1px;">MODULE 3</h6>
                    <h3 class="fw-bold mb-3">Product Sourcing & Logistics</h3>
                    <p class="text-secondary mb-0">Connect with the best local suppliers in UAE & KSA who will pack and deliver orders directly to your customers.</p>
                </div>
                <!-- Module 4 -->
                <div class="p-4 p-md-5 rounded-4 shadow-sm mb-4 border-start border-5" style="border-color: var(--primary-color) !important; background-color: var(--card-bg);" data-aos="fade-up">
                    <h6 class="fw-bold mb-2" style="color: var(--primary-color); letter-spacing: 1px;">MODULE 4</h6>
                    <h3 class="fw-bold mb-3">Product Research Made Simple</h3>
                    <p class="text-secondary mb-0">Step-by-step techniques to find winning products that have high margins and low competition in the UAE and KSA markets.</p>
                </div>
                <!-- Module 5 -->
                <div class="p-4 p-md-5 rounded-4 shadow-sm mb-4 border-start border-5" style="border-color: var(--primary-color) !important; background-color: var(--card-bg);" data-aos="fade-up">
                    <h6 class="fw-bold mb-2" style="color: var(--primary-color); letter-spacing: 1px;">MODULE 5</h6>
                    <h3 class="fw-bold mb-3">TikTok Ads — From First Ad to Pro</h3>
                    <p class="text-secondary mb-0">Leverage the cheapest traffic source right now. Learn how to create viral TikTok creatives that print money.</p>
                </div>
                <!-- Module 6 -->
                <div class="p-4 p-md-5 rounded-4 shadow-sm mb-4 border-start border-5" style="border-color: var(--primary-color) !important; background-color: var(--card-bg);" data-aos="fade-up">
                    <h6 class="fw-bold mb-2" style="color: var(--primary-color); letter-spacing: 1px;">MODULE 6</h6>
                    <h3 class="fw-bold mb-3">Facebook Ads Made Simple</h3>
                    <p class="text-secondary mb-0">Setting up Meta Business Suite from scratch. Account & payment setup that avoids restrictions.</p>
                </div>
                <!-- Module 7 -->
                <div class="p-4 p-md-5 rounded-4 shadow-sm mb-4 border-start border-5" style="border-color: var(--primary-color) !important; background-color: var(--card-bg);" data-aos="fade-up">
                    <h6 class="fw-bold mb-2" style="color: var(--primary-color); letter-spacing: 1px;">MODULE 7</h6>
                    <h3 class="fw-bold mb-3">Making Ads That Actually Get Clicks</h3>
                    <p class="text-secondary mb-0">My 3-second hook formula to stop the scroll. AI tools & ChatGPT prompts to write your ad scripts.</p>
                </div>
                <!-- Module 8 -->
                <div class="p-4 p-md-5 rounded-4 shadow-sm mb-4 border-start border-5" style="border-color: var(--primary-color) !important; background-color: var(--card-bg);" data-aos="fade-up">
                    <h6 class="fw-bold mb-2" style="color: var(--primary-color); letter-spacing: 1px;">MODULE 8</h6>
                    <h3 class="fw-bold mb-3">5 Ways to Scale (TikTok + Facebook)</h3>
                    <p class="text-secondary mb-0">Scaling slowly and safely for steady growth. How to scale faster — without breaking your ads.</p>
                </div>
                <!-- Module 9 -->
                <div class="p-4 p-md-5 rounded-4 shadow-sm mb-4 border-start border-5" style="border-color: var(--primary-color) !important; background-color: var(--card-bg);" data-aos="fade-up">
                    <h6 class="fw-bold mb-2" style="color: var(--primary-color); letter-spacing: 1px;">MODULE 9</h6>
                    <h3 class="fw-bold mb-3">Turning Visitors Into Real Orders</h3>
                    <p class="text-secondary mb-0">Product page layouts that make people want to buy. How to build trust for COD (Cash on Delivery) stores.</p>
                </div>
                <!-- Module 10 -->
                <div class="p-4 p-md-5 rounded-4 shadow-sm mb-4 border-start border-5" style="border-color: var(--primary-color) !important; background-color: var(--card-bg);" data-aos="fade-up">
                    <h6 class="fw-bold mb-2" style="color: var(--primary-color); letter-spacing: 1px;">MODULE 10</h6>
                    <h3 class="fw-bold mb-3">My Trusted UAE & KSA Suppliers List</h3>
                    <p class="text-secondary mb-0">Verified UAE suppliers with fast delivery & Arabic packaging. Private supplier lists for KSA & Pakistan.</p>
                </div>
                <!-- Module 11 -->
                <div class="p-4 p-md-5 rounded-4 shadow-sm border-start border-5" style="border-color: var(--primary-color) !important; background-color: var(--card-bg);" data-aos="fade-up">
                    <h6 class="fw-bold mb-2" style="color: var(--primary-color); letter-spacing: 1px;">MODULE 11</h6>
                    <h3 class="fw-bold mb-3">Lifetime Mentorship & Community</h3>
                    <p class="text-secondary mb-0">Lifetime access to all updates and new lessons. A private community of students learning together.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 9: Free Bonuses Worth Rs 30,000+ -->
<section class="py-5 font-inter border-top">
    <div class="container text-center py-5">
        <h2 class="fw-black mb-5" style="font-style: italic; background: linear-gradient(90deg, var(--primary-color), var(--secondary-color)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: clamp(1.8rem, 2.5vw, 2.2rem);" data-aos="fade-up">FREE BONUSES WORTH RS 30,000+</h2>
        <div class="row g-4 justify-content-center">
            <div class="col-md-4 col-6" data-aos="zoom-in" data-aos-delay="100">
                <div class="p-4 rounded-4 text-center h-100 d-flex flex-column justify-content-center" style="border: 1px solid var(--border-color); background-color: var(--card-bg);">
                    <div class="mb-3" style="font-size: 3rem;">🎥</div>
                    <h5 class="fw-bold text-white mb-2">Weekly Live Class</h5>
                    <p class="small text-secondary mb-0">Worth Rs. 20,000</p>
                </div>
            </div>
            <div class="col-md-4 col-6" data-aos="zoom-in" data-aos-delay="200">
                <div class="p-4 rounded-4 text-center h-100 d-flex flex-column justify-content-center" style="border: 1px solid var(--border-color); background-color: var(--card-bg);">
                    <div class="mb-3" style="font-size: 3rem;">📊</div>
                    <h5 class="fw-bold text-white mb-2">Live Campaign Checking</h5>
                    <p class="small text-secondary mb-0">Worth Rs. 15,000</p>
                </div>
            </div>
            <div class="col-md-4 col-6" data-aos="zoom-in" data-aos-delay="300">
                <div class="p-4 rounded-4 text-center h-100 d-flex flex-column justify-content-center" style="border: 1px solid var(--border-color); background-color: var(--card-bg);">
                    <div class="mb-3" style="font-size: 3rem;">📘</div>
                    <h5 class="fw-bold text-white mb-2">FB Zero to Hero E-Book</h5>
                    <p class="small text-secondary mb-0">Worth Rs. 5,000</p>
                </div>
            </div>
            <div class="col-md-4 col-6" data-aos="zoom-in" data-aos-delay="400">
                <div class="p-4 rounded-4 text-center h-100 d-flex flex-column justify-content-center" style="border: 1px solid var(--border-color); background-color: var(--card-bg);">
                    <div class="mb-3" style="font-size: 3rem;">🧮</div>
                    <h5 class="fw-bold text-white mb-2">Profit & Loss Calculator</h5>
                    <p class="small text-secondary mb-0">Worth Rs. 10,000</p>
                </div>
            </div>
            <div class="col-md-4 col-6" data-aos="zoom-in" data-aos-delay="500">
                <div class="p-4 rounded-4 text-center h-100 d-flex flex-column justify-content-center" style="border: 1px solid var(--border-color); background-color: var(--card-bg);">
                    <div class="mb-3" style="font-size: 3rem;">🎁</div>
                    <h5 class="fw-bold text-white mb-2">Premium Shopify Themes</h5>
                    <p class="small text-secondary mb-0">Worth Rs. 35,000</p>
                </div>
            </div>
            <div class="col-md-4 col-6" data-aos="zoom-in" data-aos-delay="600">
                <div class="p-4 rounded-4 text-center h-100 d-flex flex-column justify-content-center" style="border: 1px solid rgba(255,255,255,0.1); background-color: var(--card-bg);">
                    <div class="mb-3" style="font-size: 3rem;">🤖</div>
                    <h5 class="fw-bold text-white mb-2">ChatGPT Prompts Pack</h5>
                    <p class="small text-secondary mb-0">Worth Rs. 5,000</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 10: Students Success (Video + Screenshots combined) -->
<section class="py-5 font-inter text-center border-top">
    <div class="container py-5">
        <h2 class="fw-black mb-5" style="font-style: italic; font-size: clamp(1.8rem, 2.5vw, 2.2rem);" data-aos="fade-up">STUDENTS SUCCESS</h2>
        
        <div class="row justify-content-center g-3 mb-5">
            <?php if(!empty($videos)): ?>
                <?php foreach($videos as $i => $video): ?>
                <div class="col-6 col-md-4 col-lg-3" data-aos="zoom-in" data-aos-delay="<?= ($i+1) * 50 ?>">
                    <div class="position-relative bg-dark rounded-4 overflow-hidden shadow-sm" style="padding-top: 177%; border: 3px solid #fff;">
                        <iframe src="<?= htmlspecialchars($video['video_url']) ?>" class="position-absolute top-0 start-0 w-100 h-100" style="object-fit: cover;" allowfullscreen></iframe>
                    </div>
                </div>
                <?php endforeach; ?>
            <?php else: ?>
                <!-- No videos fallback -->
            <?php endif; ?>
        </div>
        
        <div class="row justify-content-center g-3">
            <?php if(!empty($proofs)): ?>
                <?php foreach($proofs as $i => $proof): ?>
                <div class="col-6 col-md-4" data-aos="fade-up" data-aos-delay="<?= ($i+1) * 100 ?>">
                    <div class="bg-light rounded-4 border p-2 shadow-sm" style="height: 250px; display: flex; align-items: center; justify-content: center; overflow: hidden; background-color: var(--card-bg) !important; border-color: var(--border-color) !important;">
                        <img src="<?= BASE_URL ?>/<?= htmlspecialchars($proof['image_path']) ?>" class="img-fluid rounded" style="object-fit: contain; width: 100%; height: 100%;" alt="Student Result">
                    </div>
                </div>
                <?php endforeach; ?>
            <?php else: ?>
                <!-- No proofs fallback -->
            <?php endif; ?>
        </div>
        
        <a href="<?= BASE_URL ?>/home/checkout" class="btn btn-premium px-5 py-3 mt-5 text-uppercase shadow">ENROLL IN THE PROGRAM NOW</a>
    </div>
</section>

<!-- SECTION 11: Now You Have 2 Options Left -->
<section class="py-5 font-inter border-top">
    <div class="container py-4 text-center">
        <h2 class="fw-black mb-5" style="font-style: italic; font-size: clamp(1.8rem, 2.5vw, 2.4rem);" data-aos="fade-up">
            <?= formatDangerHeading($settings['home_options_title'] ?? "NOW YOU HAVE *2 OPTIONS* LEFT") ?>
        </h2>
        <div class="row justify-content-center g-4">
            <div class="col-md-5" data-aos="fade-right">
                <div class="p-4 p-md-5 rounded-4 h-100 border shadow-sm" style="background-color: var(--card-bg); border-color: var(--border-color) !important; border-top: 5px solid #ef4444 !important;">
                    <h3 class="fw-bold mb-4 text-danger">Option 1: Do It Yourself</h3>
                    <ul class="text-start text-secondary list-unstyled fs-5">
                        <li class="mb-3">❌ Try to figure everything out alone</li>
                        <li class="mb-3">❌ Waste money testing the wrong ads</li>
                        <li class="mb-3">❌ Get stuck finding reliable suppliers</li>
                        <li class="mb-3">❌ Wait months to see a single sale</li>
                    </ul>
                </div>
            </div>
            <div class="col-md-5" data-aos="fade-left">
                <div class="p-4 p-md-5 rounded-4 h-100 border shadow-sm" style="background-color: var(--card-bg); border-color: var(--border-color) !important; border-top: 5px solid var(--primary-color) !important;">
                    <h3 class="fw-bold mb-4" style="color: var(--primary-color);">Option 2: Join the Program</h3>
                    <ul class="text-start text-secondary list-unstyled fs-5">
                        <li class="mb-3">✅ Get a proven, copy-paste blueprint</li>
                        <li class="mb-3">✅ Let us guide you step-by-step</li>
                        <li class="mb-3">✅ Connect with verified suppliers instantly</li>
                        <li class="mb-3">✅ Launch your store and start scaling fast</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 12: What Does Waiting Really Cost You? -->
<section class="py-5 font-inter border-top text-center">
    <div class="container py-4">
        <h2 class="fw-black mb-5" style="font-style: italic; font-size: clamp(1.8rem, 2.5vw, 2.4rem);" data-aos="fade-up">
            <?= htmlspecialchars($settings['home_cost_waiting_title'] ?? "WHAT DOES WAITING REALLY COST YOU?") ?>
        </h2>
        <div class="row g-4 text-start justify-content-center">
            <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="100">
                <div class="p-4 rounded-4 h-100 border shadow-sm" style="background-color: var(--card-bg); border-color: var(--border-color) !important;">
                    <h5 class="fw-bold mb-2">Still Stuck at "Someday"</h5>
                    <p class="text-secondary small mb-0">Every day you wait is another day you spend wishing for a better income instead of actually building it.</p>
                </div>
            </div>
            <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="200">
                <div class="p-4 rounded-4 h-100 border shadow-sm" style="background-color: var(--card-bg); border-color: var(--border-color) !important;">
                    <h5 class="fw-bold mb-2">Watching Others Move Ahead</h5>
                    <p class="text-secondary small mb-0">Other beginners are launching their stores today. By next month, they'll be making profit while you're still deciding.</p>
                </div>
            </div>
            <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="300">
                <div class="p-4 rounded-4 h-100 border shadow-sm" style="background-color: var(--card-bg); border-color: var(--border-color) !important;">
                    <h5 class="fw-bold mb-2">Money Lost to Trial & Error</h5>
                    <p class="text-secondary small mb-0">Trying to learn without a mentor usually costs 10x more in wasted ad spend and bad decisions.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 13: Course Fee vs. The Cost of Waiting (Value/Pricing Box) -->
<section class="py-5 border-top">
    <div class="container text-center pt-3">
        <h2 class="fw-black mb-5" style="font-style: italic; font-size: clamp(1.8rem, 2.5vw, 2.2rem);" data-aos="fade-up">COURSE FEE VS. THE COST OF WAITING</h2>
        <div class="row justify-content-center">
            <div class="col-lg-10">
                <div class="card shadow border-0 rounded-4 overflow-hidden" data-aos="zoom-in" style="border: 1px solid var(--border-color) !important;">
                    <div class="row g-0">
                        <div class="col-md-6 p-4 p-md-5 d-flex flex-column justify-content-center text-start" style="background-color: rgba(0,0,0,0.5); color: white;">
                            <h4 class="fw-bold mb-4" style="background: linear-gradient(90deg, var(--primary-color), var(--secondary-color)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">TOTAL VALUE</h4>
                            <div class="d-flex justify-content-between mb-3 pb-3 border-bottom" style="border-color: var(--border-color) !important;">
                                <span class="fs-6 fs-md-5">Course Value</span><span class="fs-6 fs-md-5 fw-bold">Rs. 50,000</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3 pb-3 border-bottom" style="border-color: var(--border-color) !important;">
                                <span class="fs-6 fs-md-5">Premium Theme</span><span class="fs-6 fs-md-5 fw-bold">Rs. 35,000</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3 pb-3 border-bottom" style="border-color: var(--border-color) !important;">
                                <span class="fs-6 fs-md-5">Bonus Tools</span><span class="fs-6 fs-md-5 fw-bold">Rs. 30,000</span>
                            </div>
                            <div class="d-flex justify-content-between mt-4">
                                <h4 class="fw-bold">Total Value</h4><h4 class="fw-bold text-danger text-decoration-line-through">Rs. <?= number_format($settings['course_original_price'] ?? 32500) ?></h4>
                            </div>
                        </div>
                        <div class="col-md-6 p-4 p-md-5 d-flex flex-column justify-content-center text-center" style="background-color: var(--card-bg);">
                            <h5 class="fw-bold text-secondary mb-2" style="letter-spacing: 1px;">TODAY'S SPECIAL PRICE</h5>
                            <h1 class="fw-black mb-4" style="font-size: clamp(2.5rem, 4vw, 3.2rem); color: var(--text-color);">PKR <?= number_format($settings['course_price'] ?? 3900) ?>/-</h1>
                            <a href="<?= BASE_URL ?>/home/checkout" class="btn btn-premium py-3 fs-5 text-uppercase">GET ACCESS NOW</a>
                            <p class="small text-muted mt-4 mb-0 fw-bold">✔ One-Time Payment &nbsp; ✔ Lifetime Access &nbsp; ✔ Secure Checkout</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 14: Here’s What Most People Ask Before Joining (FAQs) -->
<section class="py-5 font-inter border-top">
    <div class="container py-5">
        <h2 class="fw-black text-center mb-5" style="font-style: italic; font-size: clamp(1.8rem, 2.5vw, 2.2rem);" data-aos="fade-up">HERE'S WHAT MOST PEOPLE ASK BEFORE JOINING</h2>
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="accordion" id="faqAccordion">
                    
                    <div class="accordion-item mb-3 border rounded-3 shadow-sm" data-aos="fade-up" data-aos-delay="100">
                        <h2 class="accordion-header"><button class="accordion-button collapsed fw-bold p-4 bg-light text-dark fs-5" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">Is this course suitable for beginners?</button></h2>
                        <div id="faq1" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body text-secondary fs-6 p-4">Absolutely. This course is built for complete beginners and guides you step by step through the entire process — no prior experience needed.</div></div>
                    </div>
                    
                    <div class="accordion-item mb-3 border rounded-3 shadow-sm" data-aos="fade-up" data-aos-delay="150">
                        <h2 class="accordion-header"><button class="accordion-button collapsed fw-bold p-4 bg-light text-dark fs-5" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">How much investment do I need to start?</button></h2>
                        <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body text-secondary fs-6 p-4">You can get started in the UAE, KSA, and Pakistani markets with as little as 15K PKR using the strategies taught in the course. Your actual results depend on your own effort, niche, and execution.</div></div>
                    </div>
                    
                    <div class="accordion-item mb-3 border rounded-3 shadow-sm" data-aos="fade-up" data-aos-delay="200">
                        <h2 class="accordion-header"><button class="accordion-button collapsed fw-bold p-4 bg-light text-dark fs-5" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">Is this a scam? How do I know it’s genuine?</button></h2>
                        <div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body text-secondary fs-6 p-4">Not at all. We pride ourselves on transparency and real value. You get instant access to our student portal right after payment.</div></div>
                    </div>

                    <div class="accordion-item mb-3 border rounded-3 shadow-sm" data-aos="fade-up" data-aos-delay="250">
                        <h2 class="accordion-header"><button class="accordion-button collapsed fw-bold p-4 bg-light text-dark fs-5" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">Do you provide support after the course?</button></h2>
                        <div id="faq4" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body text-secondary fs-6 p-4">Yes — we provide lifetime support to all our students. You can ask questions directly on WhatsApp, plus get access to our private communities.</div></div>
                    </div>

                    <div class="accordion-item mb-3 border rounded-3 shadow-sm" data-aos="fade-up" data-aos-delay="300">
                        <h2 class="accordion-header"><button class="accordion-button collapsed fw-bold p-4 bg-light text-dark fs-5" type="button" data-bs-toggle="collapse" data-bs-target="#faq5">Do you provide dropshipping and private suppliers?</button></h2>
                        <div id="faq5" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body text-secondary fs-6 p-4">Yes. Inside the course, you get a complete list of verified UAE & KSA suppliers, plus private supplier lists that aren’t shared publicly.</div></div>
                    </div>

                    <div class="accordion-item mb-3 border rounded-3 shadow-sm" data-aos="fade-up" data-aos-delay="350">
                        <h2 class="accordion-header"><button class="accordion-button collapsed fw-bold p-4 bg-light text-dark fs-5" type="button" data-bs-toggle="collapse" data-bs-target="#faq6">How long is the course and how many lectures?</button></h2>
                        <div id="faq6" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body text-secondary fs-6 p-4">The course is around 7–8 hours of training, split into 35–36 easy-to-follow video lectures you can watch at your own pace.</div></div>
                    </div>

                    <div class="accordion-item mb-3 border rounded-3 shadow-sm" data-aos="fade-up" data-aos-delay="400">
                        <h2 class="accordion-header"><button class="accordion-button collapsed fw-bold p-4 bg-light text-dark fs-5" type="button" data-bs-toggle="collapse" data-bs-target="#faq7">How do I get access after I pay?</button></h2>
                        <div id="faq7" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body text-secondary fs-6 p-4">Click the enroll button and complete payment using the account details shown. Then fill out the registration form. You’ll receive LMS access on the email you provide.</div></div>
                    </div>

                    <div class="accordion-item mb-3 border rounded-3 shadow-sm" data-aos="fade-up" data-aos-delay="450">
                        <h2 class="accordion-header"><button class="accordion-button collapsed fw-bold p-4 bg-light text-dark fs-5" type="button" data-bs-toggle="collapse" data-bs-target="#faq8">Is it a one-time fee or recurring?</button></h2>
                        <div id="faq8" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body text-secondary fs-6 p-4">One-time fee with lifetime access. All future lectures and updates are added to the same portal — you get them free, with nothing extra to pay.</div></div>
                    </div>

                    <div class="accordion-item mb-3 border rounded-3 shadow-sm" data-aos="fade-up" data-aos-delay="500">
                        <h2 class="accordion-header"><button class="accordion-button collapsed fw-bold p-4 bg-light text-dark fs-5" type="button" data-bs-toggle="collapse" data-bs-target="#faq9">Can I do this from my mobile, while working a job?</button></h2>
                        <div id="faq9" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body text-secondary fs-6 p-4">Yes. You only need a mobile or laptop and an internet connection. Many of our students are job holders and learn in their free time at their own pace.</div></div>
                    </div>

                    <div class="accordion-item mb-3 border rounded-3 shadow-sm" data-aos="fade-up" data-aos-delay="550">
                        <h2 class="accordion-header"><button class="accordion-button collapsed fw-bold p-4 bg-light text-dark fs-5" type="button" data-bs-toggle="collapse" data-bs-target="#faq10">What if I’m not satisfied after enrolling?</button></h2>
                        <div id="faq10" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body text-secondary fs-6 p-4">We offer a 14-day money-back guarantee. If it’s not the right fit for you, you’re covered.</div></div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 15: Take the First Step Toward a Profitable Dropshipping Business (Final CTA) -->
<section class="py-5 font-inter border-top text-center" style="background: radial-gradient(circle, rgba(0,255,136,0.05) 0%, transparent 60%);">
    <div class="container py-5">
        <span class="badge mb-3 px-3 py-2 text-dark" style="background-color: var(--primary-color); letter-spacing: 2px;">JOIN 9,700+ STUDENTS</span>
        <h2 class="fw-black mb-4" style="font-size: clamp(2rem, 3.5vw, 3rem); font-style: italic; line-height: 1.2;" data-aos="fade-up">
            <?= formatHeading($settings['home_final_cta_title'] ?? "TAKE THE FIRST STEP TOWARD A\n*PROFITABLE ONLINE BUSINESS*") ?>
        </h2>
        <p class="text-secondary fs-5 mb-5" data-aos="fade-up" data-aos-delay="100">
            <?= htmlspecialchars($settings['home_final_cta_subtitle'] ?? "Thousands of beginners across UAE & KSA markets have already started. Today it's your turn.") ?>
        </p>
        <a href="<?= BASE_URL ?>/home/checkout" class="btn btn-premium px-5 py-4 fs-4 text-uppercase shadow-lg mb-3" data-aos="zoom-in" data-aos-delay="200">YES! I WANT TO LEARN THIS</a>
        <p class="text-muted small fw-bold">14-day money-back guarantee • Lifetime access & support</p>
    </div>
</section>
