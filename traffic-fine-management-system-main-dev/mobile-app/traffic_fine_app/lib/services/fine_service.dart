import '../models/fine_model.dart';
import 'api_client.dart';

class FineService {
  final ApiClient _api = ApiClient();

  FineService();

  /// Search a fine by its reference number.
  /// Calls GET /fines/{referenceNumber}
  Future<Map<String, dynamic>> searchFine(String referenceNumber) async {
    final res = await _api.get('/fines/$referenceNumber');
    final status = res['statusCode'] as int;
    final body = res['body'] as Map<String, dynamic>;

    if (status == 200 && body['success'] == true) {
      final data = body['data'] as Map<String, dynamic>?;
      if (data != null) {
        return {'ok': true, 'fine': FineModel.fromJson(data)};
      }
    }
    return {
      'ok': false,
      'message': body['message'] ?? 'Fine not found',
      'status': status,
    };
  }

  /// Get all fines for a specific driver ID.
  /// Calls GET /fines/driver/{driverId}
  Future<Map<String, dynamic>> getFinesByDriver(String driverId) async {
    final res = await _api.get('/fines/driver/$driverId');
    final status = res['statusCode'] as int;
    final body = res['body'] as Map<String, dynamic>;

    if (status == 200 && body['success'] == true) {
      final data = body['data'] as List<dynamic>?;
      if (data != null) {
        final fines = data.map((json) => FineModel.fromJson(json as Map<String, dynamic>)).toList();
        return {'ok': true, 'fines': fines};
      }
    }
    return {
      'ok': false,
      'message': body['message'] ?? 'Failed to load fines',
      'status': status,
    };
  }
}
