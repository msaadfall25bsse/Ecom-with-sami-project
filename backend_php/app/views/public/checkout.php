<!-- Top White Section -->
<section class="py-5 text-center" style="font-family: 'Inter', sans-serif;">
    <div class="container pb-4">
        <!-- Title -->
        <h2 class="fw-bold mb-5" style="font-size: 2.2rem; font-style: italic;">
            Follow These <span style="background: linear-gradient(90deg, var(--primary-color), var(--secondary-color)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">3 Simple Steps</span> to Get Instant Access<br>to the Complete Course
        </h2>
        
        <!-- 3 Steps Grid -->
        <div class="row justify-content-center mb-5 g-4">
            <div class="col-md-3">
                <div class="d-flex align-items-center justify-content-center mb-3">
                    <div class="rounded-circle d-flex align-items-center justify-content-center shadow-sm" style="width: 40px; height: 40px; background: linear-gradient(90deg, var(--primary-color), var(--secondary-color)); color: #030708 !important;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-wallet2" viewBox="0 0 16 16"><path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"/></svg>
                    </div>
                    <h4 class="fw-bold ms-3 m-0" style="font-style: italic;">Step 01</h4>
                </div>
                <p class="text-muted small">Deposit the amount of PKR <?= number_format($settings['course_price'] ?? 3900) ?>/- to one of the accounts below.</p>
            </div>
            <div class="col-md-3 border-start border-end">
                <div class="d-flex align-items-center justify-content-center mb-3">
                    <div class="rounded-circle d-flex align-items-center justify-content-center shadow-sm" style="width: 40px; height: 40px; background: linear-gradient(90deg, var(--primary-color), var(--secondary-color)); color: #030708 !important;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-camera" viewBox="0 0 16 16"><path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z"/><path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/></svg>
                    </div>
                    <h4 class="fw-bold ms-3 m-0" style="font-style: italic;">Step 02</h4>
                </div>
                <p class="text-muted small">Take a payment screenshot after you successfully pay the fee.</p>
            </div>
            <div class="col-md-3">
                <div class="d-flex align-items-center justify-content-center mb-3">
                    <div class="rounded-circle d-flex align-items-center justify-content-center shadow-sm" style="width: 40px; height: 40px; background: linear-gradient(90deg, var(--primary-color), var(--secondary-color)); color: #030708 !important;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-file-earmark-text" viewBox="0 0 16 16"><path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/><path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2.5a1 1 0 0 0 1 1H13v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/></svg>
                    </div>
                    <h4 class="fw-bold ms-3 m-0" style="font-style: italic;">Step 03</h4>
                </div>
                <p class="text-muted small">Fill out the form below and attach the payment screenshot.</p>
            </div>
        </div>

        <!-- Bank Details Box -->
        <div class="row justify-content-center">
            <div class="col-lg-6 col-md-8">
                <div class="card shadow-lg border-0 rounded-4 p-4 text-center text-break">
                    <h5 class="fw-bold mb-4 fs-6 fs-md-5" style="font-style: italic;">Deposit the amount of PKR <?= number_format($settings['course_price'] ?? 3900) ?> into<br>one of the accounts listed below:</h5>
                    
                    <p class="fw-bold text-muted small mb-2 text-uppercase" style="letter-spacing: 1px;">YOU CAN DEPOSIT IN ANY OF THE ACCOUNTS LISTED BELOW</p>
                    
                    <!-- Meezan Bank -->
                    <div class="mb-4 text-center mt-3 text-break">
                        <div class="d-inline-block text-white rounded-pill px-3 px-md-4 py-2 fw-bold mb-2 shadow-sm fs-6 fs-md-5" style="background: linear-gradient(90deg, var(--primary-color), var(--secondary-color)); color: #030708 !important;">Meezan Bank Limited</div>
                        <p class="mb-1 fw-bold fs-6">Account Title: <?= htmlspecialchars($settings['bank_meezan_title'] ?? 'Abid Hussain') ?></p>
                        <div class="mb-1 d-inline-flex align-items-center border px-2 px-md-3 py-1 rounded bg-light small allow-select">
                            <span class="fw-bold me-1">Account Number:</span>
                            <span id="meezanAcc"><?= htmlspecialchars($settings['bank_meezan'] ?? '0211 010672044') ?></span>
                            <button type="button" class="btn btn-sm btn-link p-0 ms-2 text-primary" onclick="copyText('meezanAcc', this)"><svg width="14" height="14" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/></svg></button>
                        </div><br>
                        <div class="mb-0 mt-1 d-inline-flex align-items-center border px-2 px-md-3 py-1 rounded bg-light small allow-select">
                            <span class="fw-bold me-1">IBAN:</span>
                            <span id="meezanIban">PK29MEZN000211010672044</span>
                            <button type="button" class="btn btn-sm btn-link p-0 ms-2 text-primary" onclick="copyText('meezanIban', this)"><svg width="14" height="14" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/></svg></button>
                        </div>
                    </div>

                    <!-- EasyPaisa / SadaPay / NayaPay -->
                    <div class="mb-4 text-center mt-4 text-break">
                        <div class="d-inline-block text-white rounded-pill px-3 px-md-4 py-2 fw-bold mb-2 shadow-sm fs-6 fs-md-5" style="background: linear-gradient(90deg, var(--primary-color), var(--secondary-color)); color: #030708 !important;">EasyPaisa / Naya Pay / SadaPay</div>
                        <p class="mb-1 fw-bold fs-6">Account Title: <?= htmlspecialchars($settings['bank_easypaisa_title'] ?? 'Abid Hussain') ?></p>
                        <div class="mb-0 d-inline-flex align-items-center border px-2 px-md-3 py-1 rounded bg-light small allow-select">
                            <span class="fw-bold me-1">Account Number:</span>
                            <span id="easyAcc"><?= htmlspecialchars($settings['bank_easypaisa'] ?? '0317 0000000') ?></span>
                            <button type="button" class="btn btn-sm btn-link p-0 ms-2 text-primary" onclick="copyText('easyAcc', this)"><svg width="14" height="14" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/></svg></button>
                        </div>
                    </div>

                    <!-- Jazz Cash -->
                    <div class="mb-2 text-center mt-4 text-break">
                        <div class="d-inline-block text-white rounded-pill px-3 px-md-4 py-2 fw-bold mb-2 shadow-sm fs-6 fs-md-5" style="background: linear-gradient(90deg, var(--primary-color), var(--secondary-color)); color: #030708 !important;">JAZZ CASH</div>
                        <p class="mb-1 fw-bold fs-6">Account Title: <?= htmlspecialchars($settings['bank_jazzcash_title'] ?? 'Abid Hussain') ?></p>
                        <div class="mb-0 d-inline-flex align-items-center border px-2 px-md-3 py-1 rounded bg-light small allow-select">
                            <span class="fw-bold me-1">Account Number:</span>
                            <span id="jazzAcc"><?= htmlspecialchars($settings['bank_jazzcash'] ?? '0300 0000000') ?></span>
                            <button type="button" class="btn btn-sm btn-link p-0 ms-2 text-primary" onclick="copyText('jazzAcc', this)"><svg width="14" height="14" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/></svg></button>
                        </div>
                    </div>
                    
                    <script>
                    function copyText(elementId, btn) {
                        const text = document.getElementById(elementId).innerText.trim();
                        navigator.clipboard.writeText(text).then(() => {
                            const originalHtml = btn.innerHTML;
                            btn.innerHTML = '<svg width="14" height="14" fill="currentColor" class="bi bi-check2 text-success" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>';
                            setTimeout(() => { btn.innerHTML = originalHtml; }, 2000);
                        });
                    }
                    </script>
                </div>
            </div>
        </div>

        <!-- Last Step Form -->
        <div class="row justify-content-center mt-5 pt-5">
            <div class="col-lg-6 col-md-8">
                <h4 class="fw-bold mb-1" style="font-style: italic; background: linear-gradient(90deg, var(--primary-color), var(--secondary-color)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Last Step</h4>
                <h2 class="fw-bold mb-3" style="font-style: italic;">Fill out and Submit the Form Below</h2>
                <p class="text-muted small mb-4">After payment, please fill out this form. As soon as you submit this form, your login details will automatically be activated to start learning.</p>
                
                <div class="card shadow border-0 rounded-4 p-4 text-start">
                    <h5 class="fw-bold text-center mb-4">Enrollment Form</h5>
                    <form action="<?= BASE_URL ?>/home/processCheckout" method="POST" enctype="multipart/form-data">
                        <div class="row g-3 mb-3">
                            <div class="col-md-6">
                                <label class="form-label text-muted small fw-bold">First Name *</label>
                                <input type="text" name="first_name" class="form-control border-secondary-subtle" placeholder="First Name" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label text-muted small fw-bold">Last Name *</label>
                                <input type="text" name="last_name" class="form-control border-secondary-subtle" placeholder="Last Name" required>
                            </div>
                        </div>

                        <div class="row g-3 mb-3">
                            <div class="col-md-6">
                                <label class="form-label text-muted small fw-bold">Email *</label>
                                <input type="email" name="email" class="form-control border-secondary-subtle" placeholder="Email" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label text-muted small fw-bold">Phone *</label>
                                <input type="text" name="phone" class="form-control border-secondary-subtle" placeholder="+92" required>
                            </div>
                        </div>
                        <div class="row g-3 mb-4">
                            <div class="col-md-6">
                                <label class="form-label text-muted small fw-bold">City *</label>
                                <input type="text" name="city" class="form-control border-secondary-subtle" placeholder="City" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label text-muted small fw-bold">Where did you send amount? *</label>
                                <select name="payment_method" class="form-select border-secondary-subtle" required>
                                    <option value="" selected disabled>Select Bank</option>
                                    <option value="Meezan Bank">Meezan Bank</option>
                                    <option value="EasyPaisa">EasyPaisa</option>
                                    <option value="JazzCash">JazzCash</option>
                                    <option value="SadaPay">SadaPay</option>
                                    <option value="NayaPay">NayaPay</option>
                                </select>
                            </div>
                        </div>
                        
                        <p class="text-muted small mb-2" style="font-size: 0.75rem;">Only allowed extensions are jpg, png, jpeg. Make sure the screenshot is clear and the transaction ID is visible.</p>
                        
                        <div class="mb-4">
                            <label class="form-label text-muted small fw-bold">Upload Payment Screenshot Here *</label>
                            <input type="file" name="screenshot" class="form-control border-secondary-subtle" accept="image/*" required>
                        </div>

                        <button type="submit" class="btn btn-premium w-100 py-3 fs-5 text-uppercase">Submit Now</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Dark Wave -->


<!-- Dark Features Section -->
<section class="py-5 text-white" style="background-color: var(--bg-color);">
    <div class="container py-4">
        <div class="row justify-content-center">
            <div class="col-lg-8 text-center">
                <h2 class="fw-bold mb-4 fs-3 fs-md-2" style="font-style: italic; background: linear-gradient(90deg, var(--primary-color), var(--secondary-color)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Just Within 5 Minutes Here's<br>What You're Getting</h2>
                
                <div class="text-start d-inline-block mx-auto">
                    <ul class="list-unstyled fs-6 fs-md-5 fw-bold mb-5 d-flex flex-column gap-2 gap-md-3" style="line-height: 1.5; color: var(--text-color);">
                        <li class="d-flex align-items-start"><span class="me-3 mt-1" style="color:var(--primary-color); font-size: 1.2rem;">✔</span> <span>Shopify Store Setup From Scratch To Success</span></li>
                        <li class="d-flex align-items-start"><span class="me-3 mt-1" style="color:var(--primary-color); font-size: 1.2rem;">✔</span> <span>5 Hours Value Bomb Training From Zero To Actually Sales (A-Z Course)</span></li>
                        <li class="d-flex align-items-start"><span class="me-3 mt-1" style="color:var(--primary-color); font-size: 1.2rem;">✔</span> <span>100+ Winning Products Research Without Any Tool</span></li>
                        <li class="d-flex align-items-start"><span class="me-3 mt-1" style="color:var(--primary-color); font-size: 1.2rem;">✔</span> <span>Master Facebook Ads: Launch, Scale & Optimize Campaigns</span></li>
                        <li class="d-flex align-items-start"><span class="me-3 mt-1" style="color:var(--primary-color); font-size: 1.2rem;">✔</span> <span>List Of Dropshipping Suppliers In Middle East & Pakistan</span></li>
                        <li class="d-flex align-items-start"><span class="me-3 mt-1" style="color:var(--primary-color); font-size: 1.2rem;">✔</span> <span>TikTok Ads Mastery Basic To Advanced level With Strategies For Facebook & TikTok</span></li>
                        <li class="d-flex align-items-start"><span class="me-3 mt-1" style="color:var(--primary-color); font-size: 1.2rem;">✔</span> <span>Create TikTok Agency Account FREE!</span></li>
                        <li class="d-flex align-items-start"><span class="me-3 mt-1" style="color:var(--primary-color); font-size: 1.2rem;">✔</span> <span>Lifetime Access to The Course</span></li>
                        <li class="d-flex align-items-start"><span class="me-3 mt-1" style="color:var(--primary-color); font-size: 1.2rem;">✔</span> <span>Lifetime Support (Weekly Zoom Meetings + Q&A calls)</span></li>
                    </ul>

                    <h2 class="fw-bold mb-4 text-decoration-line-through text-muted d-inline-block me-3"><?= number_format($settings['course_original_price'] ?? 32500) ?></h2>
                    <h2 class="fw-bold mb-4 d-inline-block">Only PKR <?= number_format($settings['course_price'] ?? 3900) ?></h2>
                    
                    <h4 class="fw-bold mb-3 mt-4 fs-5 fs-md-4" style="background: linear-gradient(90deg, var(--primary-color), var(--secondary-color)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Free Bonuses</h4>
                    <ul class="list-unstyled fw-bold text-muted d-flex flex-column gap-2 gap-md-3 fs-6 fs-md-5" style="line-height: 1.5;">
                        <li class="d-flex align-items-start"><span class="me-3 mt-1" style="color:var(--primary-color); font-size: 1.2rem;">✔</span> <span>Weekly 2 Hours Live Class</span></li>
                        <li class="d-flex align-items-start"><span class="me-3 mt-1" style="color:var(--primary-color); font-size: 1.2rem;">✔</span> <span>Premium WhatsApp Community</span></li>
                        <li class="d-flex align-items-start"><span class="me-3 mt-1" style="color:var(--primary-color); font-size: 1.2rem;">✔</span> <span>Direct Access to Instructor</span></li>
                        <li class="d-flex align-items-start"><span class="me-3 mt-1" style="color:var(--primary-color); font-size: 1.2rem;">✔</span> <span>Dropshipping Profit Calculator Excel</span></li>
                        <li class="d-flex align-items-start"><span class="me-3 mt-1" style="color:var(--primary-color); font-size: 1.2rem;">✔</span> <span>Premium Shopify Themes</span></li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- WhatsApp Screenshots -->
        <div class="row mt-5 g-4 justify-content-center">
            <div class="col-md-4 col-sm-6 text-center">
                <img src="https://via.placeholder.com/350x650/151a25/fff?text=WhatsApp+Result+1" class="img-fluid rounded border border-secondary shadow" alt="Proof 1">
            </div>
            <div class="col-md-4 col-sm-6 text-center">
                <img src="https://via.placeholder.com/350x650/151a25/fff?text=WhatsApp+Result+2" class="img-fluid rounded border border-secondary shadow" alt="Proof 2">
            </div>
            <div class="col-md-4 col-sm-6 text-center">
                <img src="https://via.placeholder.com/350x650/151a25/fff?text=WhatsApp+Result+3" class="img-fluid rounded border border-secondary shadow" alt="Proof 3">
            </div>
        </div>
    </div>
</section>

<!-- Bottom Wave -->


<!-- Guarantee & Footer Section -->
<section class="py-5 text-center pb-5">
    <div class="container pb-5">
        <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" fill="var(--primary-color)" class="bi bi-patch-check-fill drop-shadow mb-4" viewBox="0 0 16 16" style="filter: drop-shadow(0px 10px 15px rgba(0, 255, 136, 0.3));">
            <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01z"/>
            <text x="50%" y="42%" dominant-baseline="middle" text-anchor="middle" fill="#030708" font-size="2.6" font-weight="900">100%</text>
            <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#030708" font-size="1.4" font-weight="bold">GUARANTEE</text>
        </svg>
        
        <h2 class="fw-bold mb-3" style="background: linear-gradient(90deg, var(--primary-color), var(--secondary-color)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">14 Days Risk Free Refund Policy</h2>
        <p class="text-muted mx-auto mb-5" style="max-width: 800px; font-size: 0.9rem;">
            No questions asked! If you don't find value in this course within 14 days of purchase, simply email us at 
            <strong>support@withsami.com</strong> and we will refund 100% of your money.
        </p>

        <hr class="mb-4">
        
        <div class="text-muted small">
            <p class="mb-2">Disclaimer: Results may vary based on individual effort, experience, and market conditions. Ecom With Sami is a training program and does not guarantee financial success. All business entails risk.</p>
            <p class="mb-3">&copy; 2026 Ecom With Sami. All Rights Reserved.</p>
            <a href="#" class="text-decoration-none text-muted mx-2">Privacy Policy</a> | 
            <a href="#" class="text-decoration-none text-muted mx-2">Terms and Conditions</a> | 
            <a href="#" class="text-decoration-none text-muted mx-2">Refund Policy</a>
        </div>
    </div>
</section>
