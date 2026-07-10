import 'api_client.dart';

class PaymentService {
  final ApiClient _api = ApiClient();

  PaymentService();

  /// Pay a fine. Calls POST /payments/pay
  /// Requires: referenceNumber, categoryId, paymentMethod
  Future<Map<String, dynamic>> payFine({
    required String referenceNumber,
    required String categoryId,
    String paymentMethod = 'CARD',
    String? transactionReference,
  }) async {
    final payload = <String, dynamic>{
      'referenceNumber': referenceNumber,
      'categoryId': categoryId,
      'paymentMethod': paymentMethod,
      if (transactionReference != null) 'transactionReference': transactionReference,
    };

    final res = await _api.post('/payments/pay', payload);
    final status = res['statusCode'] as int;
    final body = res['body'] as Map<String, dynamic>;

    if ((status == 201 || status == 200) && body['success'] == true) {
      return {'ok': true, 'data': body['data'], 'message': body['message']};
    }

    return {
      'ok': false,
      'message': body['message'] ?? 'Payment failed',
      'status': status,
    };
  }
}
