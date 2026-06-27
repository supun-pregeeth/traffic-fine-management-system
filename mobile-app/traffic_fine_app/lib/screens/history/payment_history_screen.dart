import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';

class PaymentHistoryScreen extends StatelessWidget {
  const PaymentHistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final payments = [
      _PaymentRecord(
        title: 'Speeding (21–40 k...',
        fullTitle: 'Speeding (21–40 km/h over)',
        reference: 'TF-2024-001892',
        date: '13 Jun 2024',
        amount: 'LKR 5,000',
      ),
      _PaymentRecord(
        title: 'Mobile Phone Whil...',
        fullTitle: 'Mobile Phone While Driving',
        reference: 'TF-2024-007723',
        date: '12 Jun 2024',
        amount: 'LKR 3,000',
      ),
      _PaymentRecord(
        title: 'Running Red Light',
        fullTitle: 'Running Red Light',
        reference: 'TF-2024-003341',
        date: '11 Jun 2024',
        amount: 'LKR 3,000',
      ),
    ];

    return Scaffold(
      backgroundColor: AppColors.bgGrey,
      body: Column(
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
            child: payments.isEmpty
                ? _buildEmptyState()
                : ListView.builder(
                    padding: const EdgeInsets.all(20),
                    itemCount: payments.length,
                    itemBuilder: (context, index) {
                      return _PaymentCard(payment: payments[index]);
                    },
                  ),
          ),
        ],
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

// ── Payment Record Data Model ─────────────────────────────────────────────
class _PaymentRecord {
  final String title;
  final String fullTitle;
  final String reference;
  final String date;
  final String amount;

  const _PaymentRecord({
    required this.title,
    required this.fullTitle,
    required this.reference,
    required this.date,
    required this.amount,
  });
}

// ── Payment History Card ──────────────────────────────────────────────────
class _PaymentCard extends StatelessWidget {
  final _PaymentRecord payment;

  const _PaymentCard({required this.payment});

  @override
  Widget build(BuildContext context) {
    return Container(
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
            decoration: BoxDecoration(
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
                  payment.fullTitle,
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
                  payment.reference,
                  style: const TextStyle(
                    color: AppColors.primaryMid,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  payment.date,
                  style: const TextStyle(
                    color: AppColors.textGrey,
                    fontSize: 12,
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
                payment.amount,
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
    );
  }
}
