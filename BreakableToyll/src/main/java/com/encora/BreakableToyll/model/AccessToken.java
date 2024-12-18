package com.encora.BreakableToyll.model;

public class AccessToken {
    String accessToken;
    String token_type;
    int expires_in;

    public AccessToken(){}

    public AccessToken(String accessToken){
        this.accessToken = accessToken;
    }

    public AccessToken(String accessToken, String token_type, int expires_in) {
        this.accessToken = accessToken;
        this.token_type = token_type;
        this.expires_in = expires_in;
    }
}
