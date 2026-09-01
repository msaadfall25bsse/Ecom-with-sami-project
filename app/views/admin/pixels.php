<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h3 text-white">Pixel & Tracking Settings</h1>
</div>

<div class="card bg-dark text-white p-4">
    <form action="<?= BASE_URL ?>/admin/updatePixels" method="POST">
        
        <h4 class="mb-4 border-bottom border-secondary pb-2">Tracking Codes</h4>
        <p class="text-muted mb-4">Paste your Facebook Pixel, TikTok Pixel, Google Analytics, or any other tracking code here. Make sure to include the complete <code>&lt;script&gt;</code> tags.</p>

        <div class="row mb-4">
            <div class="col-md-12 mb-4">
                <label class="form-label fw-bold">&lt;head&gt; Tracking Code</label>
                <textarea name="tracking_head" class="form-control bg-dark text-white" rows="8" placeholder="Paste code that belongs inside the <head> tag..."><?= htmlspecialchars($settings['tracking_head'] ?? '') ?></textarea>
                <small class="text-muted mt-1 d-block">This code will be inserted right before the closing &lt;/head&gt; tag on all public pages.</small>
            </div>

            <div class="col-md-12 mb-3">
                <label class="form-label fw-bold">&lt;body&gt; Tracking Code</label>
                <textarea name="tracking_body" class="form-control bg-dark text-white" rows="6" placeholder="Paste code that belongs right after the opening <body> tag (e.g. Google Tag Manager noscript)..."><?= htmlspecialchars($settings['tracking_body'] ?? '') ?></textarea>
                <small class="text-muted mt-1 d-block">This code will be inserted right after the opening &lt;body&gt; tag on all public pages.</small>
            </div>
        </div>

        <div class="text-end mt-4">
            <button type="submit" class="btn btn-primary px-5 py-2 fw-bold">Save Tracking Codes</button>
        </div>
    </form>
</div>
