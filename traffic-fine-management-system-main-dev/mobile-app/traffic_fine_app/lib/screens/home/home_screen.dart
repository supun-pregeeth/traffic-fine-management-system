import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../core/constants/app_colors.dart';
import '../../models/fine_model.dart';
import '../../services/fine_service.dart';
import '../fine/fine_search_screen.dart';
import '../fine/fine_details_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  final FineService _fineService = FineService();

  String _driverName = 'Driver';
  String _vehicleNumber = 'CAB-4821';
  double _outstandingFinesAmount = 0.0;
  int _pendingCount = 0;
  List<FineModel> _recentFines = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    setState(() => _isLoading = true);
    try {
      final name = await _storage.read(key: 'auth_name');
      final driverId = await _storage.read(key: 'auth_id');

      if (name != null && name.isNotEmpty) {
        setState(() {
          _driverName = name;
        });
      }

      if (driverId != null && driverId.isNotEmpty) {
        final result = await _fineService.getFinesByDriver(driverId);
        if (result['ok'] == true) {
          final List<FineModel> fines = result['fines'] as List<FineModel>;

          double outstanding = 0.0;
          int pending = 0;
          String vehicle = 'CAB-4821';

          for (var fine in fines) {
            if (fine.status == 'PENDING') {
              outstanding += fine.amount;
              pending++;
            }
            if (fine.vehicleNumber != null && fine.vehicleNumber!.isNotEmpty) {
              vehicle = fine.vehicleNumber!;
            }
          }

          // Sort recent fines by reference or creation (newest first)
          fines.sort((a, b) => b.referenceNumber.compareTo(a.referenceNumber));

          setState(() {
            _outstandingFinesAmount = outstanding;
            _pendingCount = pending;
            _vehicleNumber = vehicle;
            _recentFines = fines.take(5).toList(); // Show up to 5 recent activities
          });
        }
      }
    } catch (e) {
      debugPrint('Error loading dashboard: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgGrey,
      body: RefreshIndicator(
        onRefresh: _loadDashboardData,
        color: AppColors.primaryMid,
        child: Column(
          children: [
            _buildHeader(context),
            Expanded(
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.only(bottom: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildQuickActions(context),
                    const SizedBox(height: 24),
                    _buildRecentActivity(context),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Dark Navy Header Section ──────────────────────────────────────────────
  Widget _buildHeader(BuildContext context) {
    return Container(
      color: AppColors.primaryDark,
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + 16,
        left: 20,
        right: 20,
        bottom: 28,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Greeting row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Good morning,',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.75),
                      fontSize: 14,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    _driverName,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              // Notification bell
              Stack(
                children: [
                  Container(
                    width: 42,
                    height: 42,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(21),
                    ),
                    child: const Icon(
                      Icons.notifications_none_rounded,
                      color: Colors.white,
                      size: 22,
                    ),
                  ),
                  if (_pendingCount > 0)
                    Positioned(
                      right: 10,
                      top: 10,
                      child: Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: AppColors.accentGold,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 20),

          // Outstanding Fines Card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.10),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withOpacity(0.15)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Outstanding Fines',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.75),
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'LKR ${_outstandingFinesAmount.toStringAsFixed(2)}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: _pendingCount > 0 ? AppColors.accentGold : AppColors.successGreen,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      _pendingCount > 0
                          ? '$_pendingCount pending fine${_pendingCount > 1 ? 's' : ''} · Vehicle: $_vehicleNumber'
                          : 'No pending fines · Vehicle: $_vehicleNumber',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.7),
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ── Quick Actions ─────────────────────────────────────────────────────────
  Widget _buildQuickActions(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'QUICK ACTIONS',
            style: TextStyle(
              color: AppColors.textGrey,
              fontSize: 11,
              fontWeight: FontWeight.w700,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _QuickActionCard(
                  icon: Icons.credit_card_rounded,
                  title: 'Pay Fine',
                  subtitle: 'Settle on-the-spot',
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const FineSearchScreen()),
                    ).then((_) => _loadDashboardData());
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _QuickActionCard(
                  icon: Icons.history_rounded,
                  title: 'Refresh',
                  subtitle: 'Get latest updates',
                  onTap: _loadDashboardData,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ── Recent Activity ───────────────────────────────────────────────────────
  Widget _buildRecentActivity(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'RECENT ACTIVITY',
                style: TextStyle(
                  color: AppColors.textGrey,
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.2,
                ),
              ),
              GestureDetector(
                onTap: _loadDashboardData,
                child: const Text(
                  'Refresh list',
                  style: TextStyle(
                    color: AppColors.primaryMid,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          if (_isLoading)
            const Center(
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: 24),
                child: CircularProgressIndicator(),
              ),
            )
          else if (_recentFines.isEmpty)
            Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 36),
                child: Column(
                  children: [
                    Icon(Icons.assignment_turned_in_outlined, size: 48, color: AppColors.textGrey.withOpacity(0.5)),
                    const SizedBox(height: 12),
                    Text(
                      'No recent fines found',
                      style: TextStyle(color: AppColors.textGrey.withOpacity(0.8), fontSize: 14, fontWeight: FontWeight.w500),
                    ),
                  ],
                ),
              ),
            )
          else
            ..._recentFines.map((fine) => _ActivityCard(fine: fine, onRefresh: _loadDashboardData)),
        ],
      ),
    );
  }
}

// ── Quick Action Card ─────────────────────────────────────────────────────
class _QuickActionCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _QuickActionCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: AppColors.primaryDark,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: Colors.white, size: 22),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: const TextStyle(
                color: AppColors.textDark,
                fontSize: 15,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: const TextStyle(
                color: AppColors.textGrey,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Activity Card ─────────────────────────────────────────────────────────
class _ActivityCard extends StatelessWidget {
  final FineModel fine;
  final VoidCallback onRefresh;

  const _ActivityCard({required this.fine, required this.onRefresh});

  @override
  Widget build(BuildContext context) {
    final isPaid = fine.status == 'PAID';
    return GestureDetector(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(builder: (_) => FineDetailsScreen(fine: fine)),
        ).then((_) => onRefresh());
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            // Status Icon
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: isPaid ? AppColors.successGreenLight : AppColors.warningYellow.withOpacity(0.2),
                shape: BoxShape.circle,
              ),
              child: Icon(
                isPaid ? Icons.check_circle_outline_rounded : Icons.pending_actions_rounded,
                color: isPaid ? AppColors.successGreen : AppColors.accentGold,
                size: 22,
              ),
            ),
            const SizedBox(width: 12),
            // Details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    fine.description ?? fine.categoryId,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: AppColors.textDark,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    fine.referenceNumber,
                    style: const TextStyle(
                      color: AppColors.textGrey,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            // Amount + status
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  'LKR ${fine.amount.toStringAsFixed(0)}',
                  style: TextStyle(
                    color: isPaid ? AppColors.successGreen : AppColors.accentGold,
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  fine.status,
                  style: TextStyle(
                    color: isPaid ? AppColors.successGreen : AppColors.accentGold,
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
