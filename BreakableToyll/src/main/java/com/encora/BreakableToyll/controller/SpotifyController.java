package com.encora.BreakableToyll.controller;

import com.encora.BreakableToyll.model.AccessToken;
import com.encora.BreakableToyll.service.SpotifyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("Sparktify")
public class SpotifyController {

    private final SpotifyService spotifyService;

    @Autowired
    public SpotifyController(SpotifyService spotifyService) {
        this.spotifyService = spotifyService;
    }

    @GetMapping()
    public ResponseEntity<String> getWelcome(){
        return ResponseEntity.ok(spotifyService.getWelcome());
    }

    @GetMapping("test")
    public ResponseEntity<String> getTest(){
        return ResponseEntity.ok(spotifyService.getTest());
    }

    /*@GetMapping("accessToken")
    public ResponseEntity<Object> getAccessToken() throws IOException, InterruptedException {
        return ResponseEntity.ok().body(spotifyService.getAccessToken());
    }*/

    @PostMapping("auth/spotify")
    public ResponseEntity<Object> getAccessToken() throws IOException, InterruptedException {
        return ResponseEntity.ok().body(spotifyService.getAccessToken());
    }
}
