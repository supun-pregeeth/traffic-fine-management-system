class UserModel {
  final String id;
  final String name;
  final String nic;
  final String phone;

  UserModel({
    required this.id,
    required this.name,
    required this.nic,
    required this.phone,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
    id: json['id'] ?? '',
    name: json['name'] ?? '',
    nic: json['nic'] ?? '',
    phone: json['phone'] ?? '',
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'nic': nic,
    'phone': phone,
  };
}
