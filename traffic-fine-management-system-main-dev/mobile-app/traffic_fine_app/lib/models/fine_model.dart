class FineModel {
  final String referenceNumber;
  final String categoryId;
  final String? description;
  final double amount;
  final String status;
  final String? district;
  final String? vehicleNumber;
  final String? officerName;
  final String? driverName;

  FineModel({
    required this.referenceNumber,
    required this.categoryId,
    this.description,
    required this.amount,
    required this.status,
    this.district,
    this.vehicleNumber,
    this.officerName,
    this.driverName,
  });

  factory FineModel.fromJson(Map<String, dynamic> json) => FineModel(
        referenceNumber: json['referenceNumber'] ?? '',
        categoryId: json['categoryId'] ?? '',
        description: json['description'],
        amount: (json['amount'] ?? 0).toDouble(),
        status: (json['status'] ?? '').toString(),
        district: json['district'],
        vehicleNumber: json['vehicleNumber'],
        officerName: json['officerName'],
        driverName: json['driverName'],
      );
}
