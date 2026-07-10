import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../core/config.dart';

class ApiClient {
  final String baseUrl;
  final http.Client _client;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  ApiClient({http.Client? client, this.baseUrl = BASE_URL}) : _client = client ?? http.Client();

  Future<Map<String, dynamic>> post(String path, Map<String, dynamic> body, {Map<String, String>? headers}) async {
    final uri = Uri.parse('$baseUrl$path');
    final token = await _storage.read(key: 'auth_token');
    final h = {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
      ...?headers,
    };
    final res = await _client.post(uri, headers: h, body: jsonEncode(body));
    return _parseResponse(res);
  }

  Future<Map<String, dynamic>> get(String path, {Map<String, String>? headers}) async {
    final uri = Uri.parse('$baseUrl$path');
    final token = await _storage.read(key: 'auth_token');
    final h = {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
      ...?headers,
    };
    final res = await _client.get(uri, headers: h);
    return _parseResponse(res);
  }

  Map<String, dynamic> _parseResponse(http.Response res) {
    try {
      final decoded = jsonDecode(res.body) as Map<String, dynamic>;
      return {
        'statusCode': res.statusCode,
        'body': decoded,
      };
    } catch (_) {
      return {
        'statusCode': res.statusCode,
        'body': {'message': res.body},
      };
    }
  }
}
