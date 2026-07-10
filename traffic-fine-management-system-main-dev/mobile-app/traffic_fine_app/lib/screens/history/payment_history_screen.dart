import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../core/constants/app_colors.dart';
import '../../models/fine_model.dart';
import '../../services/fine_service.dart';
import '../fine/fine_details_screen.dart';

class PaymentHistoryScreen extends StatefulWidget {
  const PaymentHistoryScreen({super.key});

  @override
  State<PaymentHistoryScreen> createState() => _PaymentHistoryScreenState();
}

class _PaymentHistoryScreenState extends State<PaymentHistoryScreen> {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  final FineService _fineService = FineService();

  List<FineModel> _paidFines = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadPaymentHistory();
  }

  Future<void> _loadPaymentHistory() async {
    setState(() => _isLoading = true);
    try {
      final driverId = await _storage.read(key: 'auth_id');
      if (driverId != null && driverId.isNotEmpty) {
        final result = await _fineService.getFinesByDriver(driverId);
        if (result['ok'] == true) {
          final List<FineModel> fines = result['fines'] as List<FineModel>;
          // Filter to only display PAID fines in history
          final paid = fines.where((f) => f.status == 'PAID').toList();
          // Sort newest first
          paid.sort((a, b) => b.referenceNumber.compareTo(a.referenceNumber));

          setState(() {
            _paidFines = paid;
          });
        }
      }
    } catch (e) {
      debugPrint('Error loading payment history: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgGrey,
      body: RefreshIndicator(
        onRefresh: _loadPaymentHistory,
        color: AppColors.primaryMid,
        child: Column(
          children: [
            // ── Header ─────────────────────────────────────────────────────────
            Container(
              color: AppColors.primaryDark,
              padding: EdgeInsets.only(
                top: MediaQuery.of(context).padding.top + 20,
                left: 20,
                right: 20,
                bottom: 24,
              ),
              width: double.infinity,
              child: const Text(
                'Payment History',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),

            // ── List ───────────────────────────────────────────────────────────
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : _paidFines.isEmpty
                      ? ListView(
                          children: [
                            const SizedBox(height: 120),
                            _buildEmptyState(),
                          ],
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.all(20),
                          itemCount: _paidFines.length,
                          itemBuilder: (context, index) {
                            return _PaymentCard(
                              fine: _paidFines[index],
                              onRefresh: _loadPaymentHistory,
                            );
                          },
                        ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.receipt_long_outlined,
            size: 64,
            color: AppColors.textLight,
          ),
          const SizedBox(height: 16),
          const Text(
            'No payments yet',
            style: TextStyle(
              color: AppColors.textGrey,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Your payment history will appear here',
            style: TextStyle(
              color: AppColors.textLight,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }
}

// ── Payment History Card ──────────────────────────────────────────────────
class _PaymentCard extends StatelessWidget {
  final FineModel fine;
  final VoidCallback onRefresh;

  const _PaymentCard({required this.fine, required this.onRefresh});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(builder: (_) => FineDetailsScreen(fine: fine)),
        ).then((_) => onRefresh());
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
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
        child: Row(
          children: [
            // Green check icon
            Container(
              width: 46,
              height: 46,
              decoration: const BoxDecoration(
                color: AppColors.successGreenLight,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.check_circle_outline_rounded,
                color: AppColors.successGreen,
                size: 26,
              ),
            ),

            const SizedBox(width: 14),

            // Fine info
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
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    fine.referenceNumber,
                    style: const TextStyle(
                      color: AppColors.primaryMid,
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(width: 8),

            // Amount + status badge
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  'LKR ${fine.amount.toStringAsFixed(0)}',
                  style: const TextStyle(
                    color: AppColors.successGreen,
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.successGreenLight,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Text(
                    'Paid',
                    style: TextStyle(
                      color: AppColors.successGreen,
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                    ),
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
