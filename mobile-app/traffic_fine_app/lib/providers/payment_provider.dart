import 'package:flutter/foundation.dart';
import '../models/payment_model.dart';

class PaymentProvider extends ChangeNotifier {
  PaymentModel? _payment;

  PaymentModel? get payment => _payment;

  void setPayment(PaymentModel p) {
    _payment = p;
    notifyListeners();
  }
}
