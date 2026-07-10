package com.srilanka.trafficfine.service;

import com.srilanka.trafficfine.entity.TrafficFine;
import com.srilanka.trafficfine.entity.User;

public interface NotificationService {

    /**
     * Sends an SMS notification to the issuing officer after a fine is paid.
     *
     * @param fine   the fine that was just paid
     * @param driver the driver who completed the payment
     */
    void notifyOfficerOnPayment(TrafficFine fine, User driver);
}
