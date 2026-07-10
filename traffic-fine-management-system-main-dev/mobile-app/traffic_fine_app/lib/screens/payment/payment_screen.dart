import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/constants/app_colors.dart';
import '../../models/fine_model.dart';
import '../../services/payment_service.dart';
import 'payment_success_screen.dart';

class PaymentScreen extends StatefulWidget {
  final FineModel fine;

  const PaymentScreen({super.key, required this.fine});

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  final TextEditingController _cardNumberController = TextEditingController();
  final TextEditingController _cardHolderController = TextEditingController();
  final TextEditingController _expiryController = TextEditingController();
  final TextEditingController _cvvController = TextEditingController();
  bool _obscureCvv = true;
  bool _isLoading = false;

  // Live card display values
  String get _displayCardNumber {
    final raw = _cardNumberController.text.replaceAll(' ', '');
    if (raw.isEmpty) return '•••• •••• •••• ••••';
    final padded = raw.padRight(16, '•');
    final groups = [
      padded.substring(0, 4),
      padded.substring(4, 8),
      padded.substring(8, 12),
      padded.substring(12, 16),
    ];
    return groups.join('  ');
  }

  String get _displayName =>
      _cardHolderController.text.isEmpty ? 'YOUR NAME' : _cardHolderController.text.toUpperCase();

  String get _displayExpiry =>
      _expiryController.text.isEmpty ? 'MM/YY' : _expiryController.text;

  @override
  void initState() {
    super.initState();
    _cardNumberController.addListener(() => setState(() {}));
    _cardHolderController.addListener(() => setState(() {}));
    _expiryController.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _cardNumberController.dispose();
    _cardHolderController.dispose();
    _expiryController.dispose();
    _cvvController.dispose();
    super.dispose();
  }

  void _pay() {
    final cardNumber = _cardNumberController.text.replaceAll(' ', '');
    final cardHolder = _cardHolderController.text.trim();
    final expiry = _expiryController.text.trim();
    final cvv = _cvvController.text.trim();

    if (cardNumber.length < 16 || cardHolder.isEmpty || expiry.length < 5 || cvv.length < 3) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill in all card details correctly')),
      );
      return;
    }

    setState(() => _isLoading = true);
    PaymentService().payFine(
      referenceNumber: widget.fine.referenceNumber,
      categoryId: widget.fine.categoryId,
      paymentMethod: 'CARD',
      transactionReference: 'CARD-${cardNumber.substring(cardNumber.length - 4)}',
    ).then((resp) {
      if (!mounted) return;
      setState(() => _isLoading = false);
      if (resp['ok'] == true) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const PaymentSuccessScreen()),
        );
      } else {
        final msg = resp['message'] ?? 'Payment failed';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(msg), backgroundColor: Colors.red.shade700),
        );
      }
    }).catchError((err) {
      if (!mounted) return;
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Payment error: $err')),
      );
    });
  }

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
                  _buildReferenceChip(),
                  Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        _buildCardPreview(),
                        const SizedBox(height: 20),
                        _buildCardForm(),
                        const SizedBox(height: 20),
                        _buildPayButton(context),
                        const SizedBox(height: 16),
                        _buildSecurityFooter(),
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

  // ── App Bar ────────────────────────────────────────────────────────────────
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
              child: const Icon(
                Icons.chevron_left_rounded,
                color: Colors.white,
                size: 24,
              ),
            ),
          ),
          const SizedBox(width: 16),
          const Text(
            'Secure Payment',
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }

  // ── Reference + Amount chip row ────────────────────────────────────────────
  Widget _buildReferenceChip() {
    return Container(
      color: AppColors.primaryDark,
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.12),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.white.withOpacity(0.15)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              widget.fine.referenceNumber,
              style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w500),
            ),
            Text(
              'LKR ${widget.fine.amount.toStringAsFixed(0)}',
              style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }

  // ── Credit Card Visual Preview ─────────────────────────────────────────────
  Widget _buildCardPreview() {
    return Container(
      height: 180,
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: const LinearGradient(
          colors: [Color(0xFF0B2545), Color(0xFF1E5B96)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryDark.withOpacity(0.4),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Stack(
        children: [
          // Decorative circle (chip-like)
          Positioned(
            right: -20,
            top: -20,
            child: Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.06),
                shape: BoxShape.circle,
              ),
            ),
          ),
          Positioned(
            right: 40,
            top: 40,
            child: Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.05),
                shape: BoxShape.circle,
              ),
            ),
          ),
          // Card content
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Card number label
              Text(
                'CARD NUMBER',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.6),
                  fontSize: 10,
                  letterSpacing: 1.5,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 8),
              // Card number display
              Text(
                _displayCardNumber,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.w500,
                  letterSpacing: 2,
                ),
              ),
              const Spacer(),
              // Bottom row: cardholder + expiry
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'CARDHOLDER',
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.6),
                          fontSize: 9,
                          letterSpacing: 1.2,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        _displayName,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        'EXPIRES',
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.6),
                          fontSize: 9,
                          letterSpacing: 1.2,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        _displayExpiry,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ── Card Form ──────────────────────────────────────────────────────────────
  Widget _buildCardForm() {
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
          // Card Number
          _buildFieldLabel('Card Number'),
          const SizedBox(height: 8),
          _buildTextField(
            controller: _cardNumberController,
            hint: '1234  5678  9012  3456',
            inputFormatters: [
              FilteringTextInputFormatter.digitsOnly,
              _CardNumberFormatter(),
            ],
            keyboardType: TextInputType.number,
            maxLength: 19,
          ),

          const SizedBox(height: 16),

          // Cardholder Name
          _buildFieldLabel('Cardholder Name'),
          const SizedBox(height: 8),
          _buildTextField(
            controller: _cardHolderController,
            hint: 'Name as on card',
            keyboardType: TextInputType.name,
          ),

          const SizedBox(height: 16),

          // Expiry + CVV
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildFieldLabel('Expiry'),
                    const SizedBox(height: 8),
                    _buildTextField(
                      controller: _expiryController,
                      hint: 'MM/YY',
                      inputFormatters: [
                        FilteringTextInputFormatter.digitsOnly,
                        _ExpiryFormatter(),
                      ],
                      keyboardType: TextInputType.number,
                      maxLength: 5,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildFieldLabel('CVV'),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _cvvController,
                      obscureText: _obscureCvv,
                      keyboardType: TextInputType.number,
                      maxLength: 3,
                      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                      style: const TextStyle(
                        color: AppColors.textDark,
                        fontSize: 15,
                        letterSpacing: 4,
                      ),
                      decoration: InputDecoration(
                        hintText: '•••',
                        hintStyle: const TextStyle(
                          color: AppColors.textLight,
                          fontSize: 16,
                          letterSpacing: 4,
                        ),
                        counterText: '',
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
                        suffixIcon: GestureDetector(
                          onTap: () => setState(() => _obscureCvv = !_obscureCvv),
                          child: Icon(
                            _obscureCvv ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                            color: AppColors.textGrey,
                            size: 18,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFieldLabel(String label) {
    return Text(
      label,
      style: const TextStyle(
        color: AppColors.textDark,
        fontSize: 14,
        fontWeight: FontWeight.w600,
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hint,
    TextInputType? keyboardType,
    List<TextInputFormatter>? inputFormatters,
    int? maxLength,
  }) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      inputFormatters: inputFormatters,
      maxLength: maxLength,
      style: const TextStyle(color: AppColors.textDark, fontSize: 15, letterSpacing: 1),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: const TextStyle(color: AppColors.textLight, fontSize: 14, letterSpacing: 0.5),
        counterText: '',
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
    );
  }

  // ── Pay Button ─────────────────────────────────────────────────────────────
  Widget _buildPayButton(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 54,
      child: ElevatedButton(
        onPressed: _isLoading ? null : _pay,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primaryDark,
          foregroundColor: Colors.white,
          disabledBackgroundColor: AppColors.primaryDark.withOpacity(0.6),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          elevation: 0,
        ),
        child: _isLoading
            ? const SizedBox(
                width: 22,
                height: 22,
                child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
              )
            : Text(
                'Pay LKR ${widget.fine.amount.toStringAsFixed(0)}',
                style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
              ),
      ),
    );
  }

  // ── Security Footer ────────────────────────────────────────────────────────
  Widget _buildSecurityFooter() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Text('🔒', style: TextStyle(fontSize: 12)),
        const SizedBox(width: 6),
        Text(
          '256-bit SSL encrypted · Powered by Lanka Pay',
          style: TextStyle(
            color: AppColors.textGrey,
            fontSize: 11,
          ),
        ),
      ],
    );
  }
}

// ── Card Number Formatter (1234 5678 9012 3456) ────────────────────────────
class _CardNumberFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    final digitsOnly = newValue.text.replaceAll(RegExp(r'\D'), '');
    final buffer = StringBuffer();
    for (int i = 0; i < digitsOnly.length && i < 16; i++) {
      if (i > 0 && i % 4 == 0) buffer.write(' ');
      buffer.write(digitsOnly[i]);
    }
    final formatted = buffer.toString();
    return TextEditingValue(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }
}

// ── Expiry Formatter (MM/YY) ───────────────────────────────────────────────
class _ExpiryFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    final digitsOnly = newValue.text.replaceAll(RegExp(r'\D'), '');
    final buffer = StringBuffer();
    for (int i = 0; i < digitsOnly.length && i < 4; i++) {
      if (i == 2) buffer.write('/');
      buffer.write(digitsOnly[i]);
    }
    final formatted = buffer.toString();
    return TextEditingValue(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }
}
