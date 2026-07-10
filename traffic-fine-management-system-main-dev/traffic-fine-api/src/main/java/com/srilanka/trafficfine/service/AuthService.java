package com.srilanka.trafficfine.service;

import com.srilanka.trafficfine.dto.request.LoginRequest;
import com.srilanka.trafficfine.dto.request.RegisterRequest;
import com.srilanka.trafficfine.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
