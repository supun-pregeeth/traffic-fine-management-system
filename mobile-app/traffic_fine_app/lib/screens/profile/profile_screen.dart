import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../auth/login_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  // ── User info data (demo) ────────────────────────────────────────────────
  static const _name = 'Kamal Perera';
  static const _initials = 'KP';
  static const _nic = 'NIC: 198823401234V · Vehicle: CAB-4821';

  static const List<_InfoRow> _infoRows = [
    _InfoRow(label: 'Full Name', value: 'Kamal Perera'),
    _InfoRow(label: 'NIC Number', value: '198823401234V'),
    _InfoRow(label: 'Driving Licence', value: 'B1234567'),
    _InfoRow(label: 'Vehicle Number', value: 'CAB-4821'),
    _InfoRow(label: 'Mobile', value: '+94 77 123 4567'),
    _InfoRow(label: 'Email', value: 'kamal.p@email.com'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgGrey,
      body: Column(
        children: [
          // ── Dark navy header ─────────────────────────────────────────────
          _buildHeader(context),

          // ── Info cards + Sign Out ────────────────────────────────────────
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 32),
              child: Column(
                children: [
                  _buildInfoCard(),
                  const SizedBox(height: 20),
                  _buildSignOutButton(context),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── Header Section ────────────────────────────────────────────────────────
  Widget _buildHeader(BuildContext context) {
    return Container(
      color: AppColors.primaryDark,
      width: double.infinity,
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + 20,
        left: 20,
        right: 20,
        bottom: 28,
      ),
      child: Column(
        children: [
          // Gold avatar circle with initials
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              color: AppColors.accentGold,
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: AppColors.accentGold.withOpacity(0.4),
                  blurRadius: 16,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: const Center(
              child: Text(
                _initials,
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1,
                ),
              ),
            ),
          ),
          const SizedBox(height: 14),
          // Name
          const Text(
            _name,
            style: TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 5),
          // NIC + Vehicle
          Text(
            _nic,
            style: TextStyle(
              color: Colors.white.withOpacity(0.65),
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  // ── Info Card (all rows grouped) ─────────────────────────────────────────
  Widget _buildInfoCard() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 12,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        children: _infoRows.asMap().entries.map((entry) {
          final index = entry.key;
          final row = entry.value;
          final isLast = index == _infoRows.length - 1;

          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Label (blue)
                    Text(
                      row.label,
                      style: const TextStyle(
                        color: AppColors.primaryLight,
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    // Value (dark, bold)
                    Flexible(
                      child: Text(
                        row.value,
                        textAlign: TextAlign.right,
                        style: const TextStyle(
                          color: AppColors.textDark,
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              if (!isLast)
                const Divider(
                  height: 1,
                  indent: 20,
                  endIndent: 20,
                  color: AppColors.divider,
                ),
            ],
          );
        }).toList(),
      ),
    );
  }

  // ── Sign Out Button ───────────────────────────────────────────────────────
  Widget _buildSignOutButton(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: OutlinedButton(
        onPressed: () {
          showDialog(
            context: context,
            builder: (ctx) => AlertDialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              title: const Text(
                'Sign Out',
                style: TextStyle(
                  color: AppColors.textDark,
                  fontWeight: FontWeight.bold,
                ),
              ),
              content: const Text(
                'Are you sure you want to sign out?',
                style: TextStyle(color: AppColors.textGrey),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(ctx).pop(),
                  child: const Text(
                    'Cancel',
                    style: TextStyle(color: AppColors.textGrey),
                  ),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.of(ctx).pop();
                    Navigator.of(context).pushAndRemoveUntil(
                      MaterialPageRoute(builder: (_) => const LoginScreen()),
                      (_) => false,
                    );
                  },
                  child: const Text(
                    'Sign Out',
                    style: TextStyle(
                      color: Colors.red,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          );
        },
        style: OutlinedButton.styleFrom(
          foregroundColor: Colors.red,
          side: const BorderSide(color: Colors.red, width: 1.5),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          backgroundColor: Colors.white,
        ),
        child: const Text(
          'Sign Out',
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w700,
            color: Colors.red,
          ),
        ),
      ),
    );
  }
}

// ── Info Row Data Model ───────────────────────────────────────────────────
class _InfoRow {
  final String label;
  final String value;

  const _InfoRow({required this.label, required this.value});
}
