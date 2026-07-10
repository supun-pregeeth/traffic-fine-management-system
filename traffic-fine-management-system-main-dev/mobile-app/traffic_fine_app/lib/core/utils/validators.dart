bool validateNic(String nic) {
  // Basic placeholder validation
  return nic.isNotEmpty && nic.length >= 9;
}

bool validateLicense(String license) {
  return license.isNotEmpty;
}
