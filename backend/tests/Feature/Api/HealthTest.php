<?php
test('Root endpoint returns status 200', function () {
    $response = $this->getJson('/api');
    $response->assertStatus(200)->assertJsonStructure(['status', 'statusCode', 'message', 'data', 'timestamp']);
});

test('Health endpoint returns status 200', function () {
    $response = $this->getJson('/api/health');
    $response->assertStatus(200)->assertJsonPath('data.status', 'ok');
});
