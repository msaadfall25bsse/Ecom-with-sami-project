<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h3 text-white">Dashboard Overview</h1>
    <span class="text-muted">Welcome, <?= htmlspecialchars($_SESSION['admin_username']) ?></span>
</div>

<div class="row g-4">
    <div class="col-md-3">
        <div class="card p-4">
            <h5 class="text-muted mb-2">Total Orders</h5>
            <h2 class="text-white mb-0"><?= number_format($metrics['total_orders']) ?></h2>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card p-4">
            <h5 class="text-muted mb-2">Approved Orders</h5>
            <h2 class="text-white mb-0"><?= number_format($metrics['total_approved']) ?></h2>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card p-4">
            <h5 class="text-muted mb-2">Revenue</h5>
            <h2 class="text-success mb-0">Rs. <?= number_format($metrics['revenue']) ?></h2>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card p-4">
            <h5 class="text-muted mb-2">Pending Action</h5>
            <h2 class="text-warning mb-0"><?= number_format($metrics['pending_orders']) ?></h2>
        </div>
    </div>
</div>

<div class="row mt-5">
    <div class="col-12">
        <div class="card p-4">
            <h4 class="text-white mb-4">Recent Orders</h4>
            <div class="table-responsive">
                <table class="table table-dark table-hover align-middle">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>City</th>
                            <th>Phone</th>
                            <th>Method</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if(empty($recentOrders)): ?>
                            <tr><td colspan="6" class="text-center py-4">No orders received yet.</td></tr>
                        <?php else: ?>
                            <?php foreach($recentOrders as $order): ?>
                                <tr>
                                    <td>#<?= str_pad($order['id'], 4, '0', STR_PAD_LEFT) ?></td>
                                    <td><?= htmlspecialchars($order['first_name'] . ' ' . $order['last_name']) ?></td>
                                    <td><?= htmlspecialchars($order['city']) ?></td>
                                    <td><?= htmlspecialchars($order['phone']) ?></td>
                                    <td><?= htmlspecialchars($order['payment_method']) ?></td>
                                    <td>
                                        <?php if($order['status'] == 'approved'): ?>
                                            <span class="badge bg-success">Approved</span>
                                        <?php elseif($order['status'] == 'rejected'): ?>
                                            <span class="badge bg-danger">Rejected</span>
                                        <?php else: ?>
                                            <span class="badge bg-warning">Pending</span>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
