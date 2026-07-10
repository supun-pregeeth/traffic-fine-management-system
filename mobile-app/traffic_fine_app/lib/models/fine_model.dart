class FineModel {
  final String reference;
  final String category;
  final double amount;
  final String status;

  FineModel({
    required this.reference,
    required this.category,
    required this.amount,
    required this.status,
  });

  factory FineModel.fromJson(Map<String, dynamic> json) => FineModel(
    reference: json['reference'] ?? '',
    category: json['category'] ?? '',
    amount: (json['amount'] ?? 0).toDouble(),
    status: json['status'] ?? '',
  );

  Map<String, dynamic> toJson() => {
    'reference': reference,
    'category': category,
    'amount': amount,
    'status': status,
  };
}
