import 'package:flutter/foundation.dart';
import '../models/fine_model.dart';

class FineProvider extends ChangeNotifier {
  FineModel? _fine;

  FineModel? get fine => _fine;

  void setFine(FineModel f) {
    _fine = f;
    notifyListeners();
  }
}
