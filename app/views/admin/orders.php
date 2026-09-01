<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h3 text-white">Manage Orders</h1>
</div>

<div class="card p-4">
    <div class="table-responsive">
        <table class="table table-dark table-hover align-middle">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Payment</th>
                    <th>Screenshot</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php if(empty($orders)): ?>
                    <tr><td colspan="7" class="text-center py-4">No orders received yet.</td></tr>
                <?php else: ?>
                    <?php foreach($orders as $order): ?>
                        <tr>
                            <td>#<?= str_pad($order['id'], 4, '0', STR_PAD_LEFT) ?></td>
                            <td>
                                <strong><?= htmlspecialchars($order['first_name'] . ' ' . $order['last_name']) ?></strong><br>
                                <small class="text-muted"><?= htmlspecialchars($order['email']) ?></small>
                            </td>
                            <td>
                                <?= htmlspecialchars($order['phone']) ?><br>
                                <small class="text-muted"><?= htmlspecialchars($order['city']) ?></small>
                            </td>
                            <td><?= htmlspecialchars($order['payment_method']) ?></td>
                            <td>
                                <?php if($order['screenshot_path']): ?>
                                    <a href="<?= BASE_URL ?>/<?= htmlspecialchars($order['screenshot_path']) ?>" target="_blank" class="btn btn-sm btn-outline-info">View Receipt</a>
                                <?php else: ?>
                                    <span class="text-muted small">None</span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <?php if($order['status'] == 'approved'): ?>
                                    <span class="badge bg-success">Approved</span>
                                <?php elseif($order['status'] == 'rejected'): ?>
                                    <span class="badge bg-danger">Rejected</span>
                                <?php else: ?>
                                    <span class="badge bg-warning text-dark">Pending</span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <?php if($order['status'] == 'pending'): ?>
                                    <!-- Approve Button triggers Modal -->
                                    <button type="button" class="btn btn-sm btn-success me-1" data-bs-toggle="modal" data-bs-target="#approveModal<?= $order['id'] ?>">Approve</button>
                                    
                                    <!-- Reject Form -->
                                    <form action="<?= BASE_URL ?>/admin/updateOrderStatus" method="POST" class="d-inline">
                                        <input type="hidden" name="order_id" value="<?= $order['id'] ?>">
                                        <input type="hidden" name="status" value="rejected">
                                        <button type="submit" class="btn btn-sm btn-danger">Reject</button>
                                    </form>
                                <?php else: ?>
                                    <span class="text-white-50 small">Processed</span>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- Modals must be outside the table -->
<?php if(!empty($orders)): ?>
    <?php foreach($orders as $order): ?>
        <?php if($order['status'] == 'pending'): ?>
        <div class="modal fade" id="approveModal<?= $order['id'] ?>" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content bg-dark text-white">
                    <div class="modal-header border-secondary">
                        <h5 class="modal-title">Approve Order & Send Email</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form action="<?= BASE_URL ?>/admin/updateOrderStatus" method="POST">
                        <div class="modal-body text-start">
                            <input type="hidden" name="order_id" value="<?= $order['id'] ?>">
                            <input type="hidden" name="status" value="approved">
                            
                            <div class="mb-3">
                                <label class="form-label">Set Student Password</label>
                                <input type="text" name="student_password" id="pass_<?= $order['id'] ?>" class="form-control" placeholder="e.g. 12345678" required oninput="updateEmailTemplate(<?= $order['id'] ?>, '<?= addslashes($order['first_name']) ?>', '<?= addslashes($order['email']) ?>')">
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Email Content (Edit as needed)</label>
                                <textarea name="email_body" id="email_<?= $order['id'] ?>" class="form-control" rows="8" required></textarea>
                            </div>
                        </div>
                        <div class="modal-footer border-secondary">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-success">Approve & Send Email</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <?php endif; ?>
    <?php endforeach; ?>
<?php endif; ?>

<script>
    function updateEmailTemplate(orderId, firstName, email) {
        const passField = document.getElementById('pass_' + orderId);
        const emailField = document.getElementById('email_' + orderId);
        const password = passField.value || '[Enter Password Above]';
        
        // Use a modern HTML structure for the email
        const template = `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
  .container { background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto; }
  h2 { color: #00a2e8; }
  .btn { display: inline-block; background-color: #00a2e8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
  .footer { margin-top: 30px; font-size: 12px; color: #888; text-align: center; }
</style>
</head>
<body>
<div class="container">
  <h2>Welcome to Ecom With Sami, ${firstName}!</h2>
  <p>Your payment has been successfully approved! We are excited to have you on board.</p>
  <p>Here are your login details:</p>
  <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #00a2e8; margin: 20px 0;">
    <strong>Email:</strong> ${email}<br>
    <strong>Password:</strong> ${password}
  </div>
  <p>You can log in to your dashboard to access the course content.</p>
  <a href="<?= BASE_URL ?>/login" class="btn">Login to Dashboard</a>
  <p style="margin-top:20px;">If you haven't already, please download our app for the best experience.</p>
</div>
<div class="footer">
  <p>You received this email because you subscribed to our course.</p>
  <p><a href="<?= BASE_URL ?>/unsubscribe?email=${email}">Unsubscribe</a></p>
</div>
</body>
</html>`;
        emailField.value = template;
    }

    // Initialize template when modal opens
    document.addEventListener('DOMContentLoaded', function() {
        var modals = document.querySelectorAll('.modal');
        modals.forEach(function(modal) {
            modal.addEventListener('show.bs.modal', function (event) {
                var orderId = this.id.replace('approveModal', '');
                var passField = document.getElementById('pass_' + orderId);
                if(passField) {
                    passField.dispatchEvent(new Event('input'));
                }
            });
        });
    });
</script>
