import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../fine/fine_details_screen.dart';

class FineSearchScreen extends StatefulWidget {
  const FineSearchScreen({super.key});

  @override
  State<FineSearchScreen> createState() => _FineSearchScreenState();
}

class _FineSearchScreenState extends State<FineSearchScreen> {
  final TextEditingController _referenceController = TextEditingController();
  String? _selectedCategory;
  bool _isLoading = false;

  final List<String> _categories = [
    'Speeding',
    'Red Light Violation',
    'Mobile Phone While Driving',
    'No Seat Belt',
    'Drunk Driving',
    'Illegal Parking',
    'Other',
  ];

  final List<_DemoRef> _demoRefs = const [
    _DemoRef(reference: 'TF-2024-001892', code: 'SP-002'),
    _DemoRef(reference: 'TF-2024-003341', code: 'RL-001'),
    _DemoRef(reference: 'TF-2024-007723', code: 'PH-001'),
  ];

  @override
  void dispose() {
    _referenceController.dispose();
    super.dispose();
  }

  void _findFine() {
    if (_referenceController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter a fine reference number'),
          backgroundColor: AppColors.primaryDark,
        ),
      );
      return;
    }
    setState(() => _isLoading = true);
    Future.delayed(const Duration(seconds: 1), () {
      if (!mounted) return;
      setState(() => _isLoading = false);
      Navigator.of(context).push(
        MaterialPageRoute(builder: (_) => const FineDetailsScreen()),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgGrey,
      body: Column(
        children: [
          _buildHeader(context),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  _buildSearchCard(),
                  const SizedBox(height: 16),
                  _buildDemoReferences(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── Dark Navy Header ──────────────────────────────────────────────────────
  Widget _buildHeader(BuildContext context) {
    return Container(
      color: AppColors.primaryDark,
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + 20,
        left: 20,
        right: 20,
        bottom: 28,
      ),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Pay Traffic Fine',
              style: TextStyle(
                color: Colors.white,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              'Enter the details from your fine sheet to proceed with payment.',
              style: TextStyle(
                color: Colors.white.withOpacity(0.7),
                fontSize: 13,
                height: 1.4,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Search Card ───────────────────────────────────────────────────────────
  Widget _buildSearchCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 12,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Reference Number Field
          const Text(
            'Fine Reference Number',
            style: TextStyle(
              color: AppColors.textDark,
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _referenceController,
            style: const TextStyle(color: AppColors.textDark, fontSize: 15),
            decoration: InputDecoration(
              hintText: 'e.g. TF-2024-001892',
              hintStyle: const TextStyle(color: AppColors.textLight, fontSize: 14),
              filled: true,
              fillColor: AppColors.inputFill,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: AppColors.inputBorder),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: AppColors.inputBorder),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: AppColors.primaryMid, width: 1.5),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
            ),
          ),

          const SizedBox(height: 16),

          // Fine Category Dropdown
          const Text(
            'Fine Category',
            style: TextStyle(
              color: AppColors.textDark,
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14),
            decoration: BoxDecoration(
              color: AppColors.inputFill,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppColors.inputBorder),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: _selectedCategory,
                hint: const Text(
                  'Select category...',
                  style: TextStyle(color: AppColors.textLight, fontSize: 14),
                ),
                isExpanded: true,
                icon: const Icon(Icons.keyboard_arrow_down_rounded, color: AppColors.textGrey),
                dropdownColor: Colors.white,
                items: _categories.map((c) {
                  return DropdownMenuItem<String>(
                    value: c,
                    child: Text(c, style: const TextStyle(color: AppColors.textDark, fontSize: 14)),
                  );
                }).toList(),
                onChanged: (val) => setState(() => _selectedCategory = val),
              ),
            ),
          ),

          const SizedBox(height: 20),

          // Find Fine Button
          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton.icon(
              onPressed: _isLoading ? null : _findFine,
              icon: _isLoading
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(
                        color: Colors.white,
                        strokeWidth: 2,
                      ),
                    )
                  : const Icon(Icons.search_rounded, size: 20),
              label: Text(
                _isLoading ? 'Searching...' : 'Find Fine',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryDark,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 0,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── Demo References Card ──────────────────────────────────────────────────
  Widget _buildDemoReferences() {
    return Container(
      padding: const EdgeInsets.all(20),
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
          const Text(
            'Demo References',
            style: TextStyle(
              color: AppColors.primaryMid,
              fontSize: 14,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 14),
          ..._demoRefs.map((ref) => _DemoRefRow(
                ref: ref,
                onTap: () {
                  _referenceController.text = ref.reference;
                },
              )),
        ],
      ),
    );
  }
}

// ── Demo Ref Data ─────────────────────────────────────────────────────────
class _DemoRef {
  final String reference;
  final String code;

  const _DemoRef({required this.reference, required this.code});
}

// ── Demo Ref Row ──────────────────────────────────────────────────────────
class _DemoRefRow extends StatelessWidget {
  final _DemoRef ref;
  final VoidCallback onTap;

  const _DemoRefRow({required this.ref, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 10),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              ref.reference,
              style: const TextStyle(
                color: AppColors.primaryMid,
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
            Text(
              ref.code,
              style: const TextStyle(
                color: AppColors.primaryLight,
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
