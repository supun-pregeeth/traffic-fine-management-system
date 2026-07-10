import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../models/fine_model.dart';
import '../payment/payment_screen.dart';

class FineDetailsScreen extends StatelessWidget {
  final FineModel fine;

  const FineDetailsScreen({super.key, required this.fine});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgGrey,
      body: Column(
        children: [
          _buildAppBar(context),
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: [
                  _buildAmountHeader(),
                  Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        _buildViolationDetails(),
                        const SizedBox(height: 16),
                        if (fine.officerName != null) _buildIssuingOfficer(),
                        if (fine.officerName != null) const SizedBox(height: 16),
                        _buildSmsInfoBox(),
                        const SizedBox(height: 24),
                        _buildProceedButton(context),
                        const SizedBox(height: 32),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAppBar(BuildContext context) {
    return Container(
      color: AppColors.primaryDark,
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + 8,
        left: 16,
        right: 16,
        bottom: 16,
      ),
      child: Row(
        children: [
          GestureDetector(
            onTap: () => Navigator.of(context).pop(),
            child: Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.chevron_left_rounded, color: Colors.white, size: 24),
            ),
          ),
          const SizedBox(width: 16),
          const Text(
            'Fine Details',
            style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }

  Widget _buildAmountHeader() {
    return Container(
      color: AppColors.primaryDark,
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 36),
      child: Column(
        children: [
          Text(
            'Amount Due',
            style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 14, fontWeight: FontWeight.w500),
          ),
          const SizedBox(height: 8),
          Text(
            'LKR ${fine.amount.toStringAsFixed(0)}',
            style: const TextStyle(color: Colors.white, fontSize: 40, fontWeight: FontWeight.bold, letterSpacing: 0.5),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            decoration: BoxDecoration(
              color: fine.status == 'PAID' ? AppColors.successGreen : AppColors.accentGold,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              fine.status,
              style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w700, letterSpacing: 0.5),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildViolationDetails() {
    final rows = [
      _DetailRow(label: 'Reference No.', value: fine.referenceNumber),
      if (fine.vehicleNumber != null)
        _DetailRow(label: 'Vehicle', value: fine.vehicleNumber!),
      _DetailRow(label: 'Category', value: fine.categoryId, highlight: true),
      if (fine.description != null)
        _DetailRow(label: 'Violation', value: fine.description!),
      if (fine.district != null)
        _DetailRow(label: 'District', value: fine.district!),
    ];

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 2))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'VIOLATION DETAILS',
            style: TextStyle(color: AppColors.textGrey, fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 1.2),
          ),
          const SizedBox(height: 16),
          ...rows.asMap().entries.map((entry) {
            final isLast = entry.key == rows.length - 1;
            return Column(
              children: [
                _buildDetailRow(entry.value),
                if (!isLast) const Divider(color: AppColors.divider, height: 20),
              ],
            );
          }),
        ],
      ),
    );
  }

  Widget _buildDetailRow(_DetailRow row) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(row.label, style: const TextStyle(color: AppColors.textGrey, fontSize: 13)),
        const SizedBox(width: 16),
        Flexible(
          child: Text(
            row.value,
            textAlign: TextAlign.right,
            style: TextStyle(
              color: row.highlight ? AppColors.primaryMid : AppColors.textDark,
              fontSize: 13,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildIssuingOfficer() {
    final officerName = fine.officerName ?? 'Unknown Officer';
    final initials = officerName.split(' ').map((p) => p.isNotEmpty ? p[0] : '').take(2).join();
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 2))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'ISSUING OFFICER',
            style: TextStyle(color: AppColors.textGrey, fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 1.2),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: const BoxDecoration(color: AppColors.primaryDark, shape: BoxShape.circle),
                child: Center(
                  child: Text(initials, style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  officerName,
                  style: const TextStyle(color: AppColors.textDark, fontSize: 15, fontWeight: FontWeight.w700),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSmsInfoBox() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.warningYellow,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.accentGold.withOpacity(0.4)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.info_outline_rounded, color: AppColors.accentGold, size: 18),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              'After payment, an SMS confirmation will be sent. You can then collect your driving licence.',
              style: TextStyle(color: AppColors.textDark.withOpacity(0.8), fontSize: 12, height: 1.5),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProceedButton(BuildContext context) {
    final isPaid = fine.status == 'PAID';
    return SizedBox(
      width: double.infinity,
      height: 54,
      child: ElevatedButton(
        onPressed: isPaid
            ? null
            : () {
                Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => PaymentScreen(fine: fine)),
                );
              },
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primaryDark,
          foregroundColor: Colors.white,
          disabledBackgroundColor: AppColors.textGrey,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          elevation: 0,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              isPaid ? 'Already Paid' : 'Proceed to Payment',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
            ),
            if (!isPaid) ...[
              const SizedBox(width: 8),
              const Icon(Icons.arrow_forward_rounded, size: 20),
            ],
          ],
        ),
      ),
    );
  }
}

class _DetailRow {
  final String label;
  final String value;
  final bool highlight;

  const _DetailRow({required this.label, required this.value, this.highlight = false});
}
