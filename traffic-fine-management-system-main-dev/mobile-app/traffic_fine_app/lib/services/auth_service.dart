import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'api_client.dart';

class AuthService {
  final ApiClient _api = ApiClient();
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  AuthService();

  /// Attempts to login. The backend expects an `email` and `password`.
  /// The method uses [nicOrLicense] as the `email` field for now — adjust UI
  /// to request email if you prefer strict matching.
  Future<Map<String, dynamic>> login(
    String nicOrLicense,
    String password,
  ) async {
    final payload = {'email': nicOrLicense, 'password': password};

    final res = await _api.post('/auth/login', payload);

    final status = res['statusCode'] as int;
    final body = res['body'] as Map<String, dynamic>;

    if (status == 200 && body['success'] == true) {
      final data = body['data'] as Map<String, dynamic>?;
      if (data != null && data['token'] != null) {
        await _storage.write(key: 'auth_token', value: data['token'] as String);
        await _storage.write(
          key: 'auth_email',
          value: data['email']?.toString() ?? '',
        );
        await _storage.write(
          key: 'auth_name',
          value: data['name']?.toString() ?? '',
        );
        await _storage.write(
          key: 'auth_role',
          value: data['role']?.toString() ?? '',
        );
        await _storage.write(
          key: 'auth_id',
          value: data['id']?.toString() ?? '',
        );
      }
      return {'ok': true, 'data': data, 'message': body['message']};
    }

    return {
      'ok': false,
      'message': body['message'] ?? 'Login failed',
      'status': status,
    };
  }

  Future<Map<String, dynamic>> register(Map<String, dynamic> payload) async {
    final res = await _api.post('/auth/register', payload);
    final status = res['statusCode'] as int;
    final body = res['body'] as Map<String, dynamic>;
    if ((status == 201 || status == 200) && body['success'] == true) {
      return {'ok': true, 'data': body['data'], 'message': body['message']};
    }
    return {
      'ok': false,
      'message': body['message'] ?? 'Register failed',
      'status': status,
    };
  }
}
