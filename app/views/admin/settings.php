<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h3 text-white">Website Settings</h1>
</div>

<div class="card bg-dark text-white p-4">
    <form id="settingsForm" action="<?= BASE_URL ?>/admin/updateSettings" method="POST" enctype="multipart/form-data">
        
        <h4 class="mb-4 border-bottom border-secondary pb-2">Website Text Settings</h4>
        <div class="row mb-4">
            <div class="col-md-12 mb-3">
                <label class="form-label">Top Announcement Bar Text</label>
                <input type="text" name="announcement_text" class="form-control" value="<?= htmlspecialchars($settings['announcement_text'] ?? 'Fee Locked at PKR 3,900 | Students Trained 9,700+ | UAE & KSA Dropshipping Training | Lifetime Mentorship Included | Product Hunting Without Paid Tools | Real Student Video Reviews Available') ?>">
                <small class="text-white-50">Use the <code>|</code> symbol to separate items (e.g. Item 1 | Item 2 | Item 3). It will automatically be converted to stars with spacing.</small>
            </div>
            <div class="col-md-12 mb-3">
                <label class="form-label">15-Second Popup Text (e.g. Someone from Lahore just bought the course)</label>
                <input type="text" name="popup_text" class="form-control" value="<?= htmlspecialchars($settings['popup_text'] ?? 'Someone from Lahore just bought the Ecom With Sami course!') ?>">
            </div>
        </div>

        <h4 class="mb-4 border-bottom border-secondary pb-2">App Update Settings (Forced Updates)</h4>
        <div class="row mb-4">
            <div class="col-md-6 mb-3">
                <label class="form-label">Required Android Version (Number)</label>
                <input type="number" name="android_version" class="form-control" value="<?= htmlspecialchars($settings['android_version'] ?? '10') ?>">
                <small class="text-white-50">e.g. 11. Increase this to force older versions to update.</small>
            </div>
            <div class="col-md-6 mb-3">
                <label class="form-label">Required Windows Version (Number)</label>
                <input type="number" name="windows_version" class="form-control" value="<?= htmlspecialchars($settings['windows_version'] ?? '1') ?>">
                <small class="text-white-50">e.g. 2. Increase this to force older versions to update.</small>
            </div>
            <div class="col-md-6 mb-3">
                <label class="form-label">Android Update URL (APK Link)</label>
                <input type="text" name="android_update_url" class="form-control" value="<?= htmlspecialchars($settings['android_update_url'] ?? 'https://ecomwithsami.com/public/WithSamiLMS_v10.apk') ?>">
            </div>
            <div class="col-md-6 mb-3">
                <label class="form-label">Windows Update URL (EXE Link)</label>
                <input type="text" name="windows_update_url" class="form-control" value="<?= htmlspecialchars($settings['windows_update_url'] ?? 'https://ecomwithsami.com/public/WithSamiLMS_Windows.exe') ?>">
            </div>
        </div>

        <h4 class="mb-4 border-bottom border-secondary pb-2">Pricing Settings</h4>
        <div class="row mb-4">
            <div class="col-md-6 mb-3">
                <label class="form-label">Course Original Price (PKR)</label>
                <input type="number" name="course_original_price" class="form-control" value="<?= htmlspecialchars($settings['course_original_price'] ?? '32500') ?>">
                <small class="text-white-50">This is the crossed-out price (e.g. 32500)</small>
            </div>
            <div class="col-md-6 mb-3">
                <label class="form-label">Course Current Price (PKR)</label>
                <input type="number" name="course_price" class="form-control" value="<?= htmlspecialchars($settings['course_price'] ?? '3900') ?>">
                <small class="text-white-50">This is the actual selling price (e.g. 3900)</small>
            </div>
        </div>

        <h4 class="mb-4 border-bottom border-secondary pb-2">Hero Section Video</h4>
        <div class="row mb-4">
            <div class="col-md-12 mb-3">
                <label class="form-label d-block">Video Source Type</label>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="hero_video_type" id="typeYoutube" value="youtube" <?= (!isset($settings['hero_video_type']) || $settings['hero_video_type'] == 'youtube') ? 'checked' : '' ?> onchange="toggleVideoInput()">
                    <label class="form-check-label" for="typeYoutube">YouTube Embed Link</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="hero_video_type" id="typeLocal" value="local" <?= (isset($settings['hero_video_type']) && $settings['hero_video_type'] == 'local') ? 'checked' : '' ?> onchange="toggleVideoInput()">
                    <label class="form-check-label" for="typeLocal">Upload Local Video (.mp4)</label>
                </div>
            </div>

            <div class="col-md-12 mb-3" id="youtubeInputDiv">
                <label class="form-label">YouTube Embed URL</label>
                <input type="text" name="hero_video_url" id="youtube_url" class="form-control" value="<?= htmlspecialchars($settings['hero_video_url'] ?? '') ?>">
                <small class="text-white-50">Example: https://www.youtube.com/embed/9coOU5ea3nk?rel=0</small>
            </div>

            <div class="col-md-12 mb-3" id="localInputDiv" style="display: none;">
                <label class="form-label">Upload Video File</label>
                <input type="file" name="local_hero_video" class="form-control bg-dark text-white" accept="video/mp4,video/x-m4v,video/*">
                <small class="text-warning">Current Local Video: <?= (isset($settings['hero_video_type']) && $settings['hero_video_type'] == 'local') ? htmlspecialchars($settings['hero_video_url'] ?? 'None') : 'None' ?></small>
            </div>
        </div>

        <div class="mt-4">
            <h4 class="mb-4 border-bottom border-secondary pb-2">Homepage Content Settings</h4>
            <p class="text-white-50 mb-4">Edit the main headings and subheadings of the homepage sections. <br>
            <span class="text-warning">💡 <strong>Pro Tip:</strong> Use asterisks around text like <code>*this*</code> to highlight/color it. Press <strong>Enter</strong> to create a new line.</span></p>
            
            <div class="row mb-3">
                <div class="col-md-12 mb-3">
                    <label class="form-label">Hero Section - Headline</label>
                    <textarea name="home_hero_title" class="form-control" rows="3"><?= htmlspecialchars($settings['home_hero_title'] ?? "Pakistan's #1\n*UAE & KSA DROPSHIPPING*\nTRAINING") ?></textarea>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Hero Section - Subtitle 1</label>
                    <input type="text" name="home_hero_subtitle" class="form-control" value="<?= htmlspecialchars($settings['home_hero_subtitle'] ?? 'Learn how to start online dropshipping store in UAE & KSA') ?>">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Hero Section - Subtitle 2</label>
                    <input type="text" name="home_hero_desc" class="form-control" value="<?= htmlspecialchars($settings['home_hero_desc'] ?? 'Step-By-Step Beginner Friendly Training') ?>">
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Why Dropshipping - Main Title</label>
                    <textarea name="home_why_dropshipping_title" class="form-control" rows="2"><?= htmlspecialchars($settings['home_why_dropshipping_title'] ?? "WHY DROPSHIPPING IS THE\n*SMARTEST ONLINE BUSINESS* RIGHT NOW") ?></textarea>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">What You'll Get - Main Title</label>
                    <textarea name="home_what_you_get_title" class="form-control" rows="2"><?= htmlspecialchars($settings['home_what_you_get_title'] ?? "HERE'S WHAT YOU'LL\n*GET ACCESS TO*") ?></textarea>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-4 mb-3">
                    <label class="form-label">Instructor Profile - Title</label>
                    <input type="text" name="home_instructor_title" class="form-control" value="<?= htmlspecialchars($settings['home_instructor_title'] ?? 'MEET SAMI') ?>">
                </div>
                <div class="col-md-8 mb-3">
                    <label class="form-label">Instructor Profile - Subtitle</label>
                    <input type="text" name="home_instructor_subtitle" class="form-control" value="<?= htmlspecialchars($settings['home_instructor_subtitle'] ?? '7-Figure E-commerce Entrepreneur') ?>">
                </div>
                <div class="col-md-12 mb-3">
                    <label class="form-label">Instructor Profile - Description</label>
                    <textarea name="home_instructor_desc" class="form-control" rows="3"><?= htmlspecialchars($settings['home_instructor_desc'] ?? 'Sami has built multiple successful e-commerce brands from scratch and spent millions on advertising to crack the code. Now, he is sharing his exact blueprint to help you avoid mistakes and achieve financial freedom through dropshipping.') ?></textarea>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-12 mb-3">
                    <label class="form-label">Guarantee Section - Main Title</label>
                    <input type="text" name="home_guarantee_title" class="form-control" value="<?= htmlspecialchars($settings['home_guarantee_title'] ?? 'STILL UNSURE? YOU\'RE FULLY PROTECTED.') ?>">
                </div>
                <div class="col-md-12 mb-3">
                    <label class="form-label">Guarantee Section - Description Text</label>
                    <textarea name="home_guarantee_text" class="form-control" rows="3"><?= htmlspecialchars($settings['home_guarantee_text'] ?? 'We are so confident in the value of this training that we are taking all the risk. Join the program, go through the modules, and if you don\'t feel like you received 10x the value, simply let us know within 14 days and we will refund every single penny. No questions asked.') ?></textarea>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Who Is This For - Main Title</label>
                    <input type="text" name="home_who_is_for_title" class="form-control" value="<?= htmlspecialchars($settings['home_who_is_for_title'] ?? 'WHO IS THIS FOR?') ?>">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Options Left - Main Title</label>
                    <textarea name="home_options_title" class="form-control" rows="2"><?= htmlspecialchars($settings['home_options_title'] ?? "NOW YOU HAVE *2 OPTIONS* LEFT") ?></textarea>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-12 mb-3">
                    <label class="form-label">Cost of Waiting - Main Title</label>
                    <input type="text" name="home_cost_waiting_title" class="form-control" value="<?= htmlspecialchars($settings['home_cost_waiting_title'] ?? 'WHAT DOES WAITING REALLY COST YOU?') ?>">
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-12 mb-3">
                    <label class="form-label">Final CTA Section - Main Title</label>
                    <textarea name="home_final_cta_title" class="form-control" rows="2"><?= htmlspecialchars($settings['home_final_cta_title'] ?? "TAKE THE FIRST STEP TOWARD A\n*PROFITABLE ONLINE BUSINESS*") ?></textarea>
                </div>
                <div class="col-md-12 mb-3">
                    <label class="form-label">Final CTA Section - Subtitle</label>
                    <input type="text" name="home_final_cta_subtitle" class="form-control" value="<?= htmlspecialchars($settings['home_final_cta_subtitle'] ?? 'Thousands of beginners across UAE & KSA markets have already started. Today it\'s your turn.') ?>">
                </div>
            </div>
        </div>

        <div class="mt-5">
            <h4 class="mb-4 border-bottom border-secondary pb-2">Bank Account Settings</h4>
            
            <div class="row mb-3">
                <div class="col-md-4 mb-3">
                    <label class="form-label">Meezan Bank Account Title</label>
                    <input type="text" name="bank_meezan_title" class="form-control" value="<?= htmlspecialchars($settings['bank_meezan_title'] ?? 'Abid Hussain') ?>" placeholder="e.g. Abid Hussain">
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Easypaisa / SadaPay Title</label>
                    <input type="text" name="bank_easypaisa_title" class="form-control" value="<?= htmlspecialchars($settings['bank_easypaisa_title'] ?? 'Abid Hussain') ?>" placeholder="e.g. Abid Hussain">
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">JazzCash Title</label>
                    <input type="text" name="bank_jazzcash_title" class="form-control" value="<?= htmlspecialchars($settings['bank_jazzcash_title'] ?? 'Abid Hussain') ?>" placeholder="e.g. Abid Hussain">
                </div>
            </div>

            <div class="row mb-4">
                <div class="col-md-4 mb-3">
                    <label class="form-label">Meezan Bank Account</label>
                    <input type="text" name="bank_meezan" class="form-control" value="<?= htmlspecialchars($settings['bank_meezan'] ?? '0211 010672044') ?>" placeholder="e.g. 0211 010672044">
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Easypaisa / SadaPay Account</label>
                    <input type="text" name="bank_easypaisa" class="form-control" value="<?= htmlspecialchars($settings['bank_easypaisa'] ?? '0317 0000000') ?>" placeholder="e.g. 0317 0000000">
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">JazzCash Account</label>
                    <input type="text" name="bank_jazzcash" class="form-control" value="<?= htmlspecialchars($settings['bank_jazzcash'] ?? '0300 0000000') ?>" placeholder="e.g. 0300 0000000">
                </div>
            </div>
        </div>
        
        <div class="text-end mt-4">
            <button type="submit" class="btn btn-primary px-5 py-2 fw-bold" id="saveBtn">
                <span id="saveBtnText">Save Settings</span>
                <span id="saveBtnLoading" style="display:none;">
                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>Saving...
                </span>
            </button>
        </div>
    </form>
</div>

<script>
function toggleVideoInput() {
    if (document.getElementById('typeYoutube').checked) {
        document.getElementById('youtubeInputDiv').style.display = 'block';
        document.getElementById('localInputDiv').style.display = 'none';
    } else {
        document.getElementById('youtubeInputDiv').style.display = 'none';
        document.getElementById('localInputDiv').style.display = 'block';
    }
}
document.addEventListener('DOMContentLoaded', function() {
    toggleVideoInput();
    
    document.getElementById('settingsForm').addEventListener('submit', function() {
        var btn = document.getElementById('saveBtn');
        document.getElementById('saveBtnText').style.display = 'none';
        document.getElementById('saveBtnLoading').style.display = 'inline';
        btn.disabled = true;
    });
});
</script>

