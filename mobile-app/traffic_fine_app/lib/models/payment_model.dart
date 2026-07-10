class PaymentModel {
  final String id;
  final String fineReference;
  final double amount;
  final String status;

  PaymentModel({
    required this.id,
    required this.fineReference,
    required this.amount,
    required this.status,
  });

  factory PaymentModel.fromJson(Map<String, dynamic> json) => PaymentModel(
    id: json['id'] ?? '',
    fineReference: json['fineReference'] ?? '',
    amount: (json['amount'] ?? 0).toDouble(),
    status: json['status'] ?? '',
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'fineReference': fineReference,
    'amount': amount,
    'status': status,
  };
}
